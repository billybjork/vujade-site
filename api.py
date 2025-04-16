import os
from flask import Flask, send_from_directory, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from urllib.parse import urlparse, urlunparse # Import necessary parts

# Determine the directory containing this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Set the path to the React app's build directory
react_build_directory = os.path.join(BASE_DIR, 'build')

# Initialize the Flask app with the build directory as the static folder
app = Flask(__name__, static_folder=react_build_directory)

uri = os.environ.get('DATABASE_URL')  # or other relevant config var
if uri and uri.startswith("postgres://"): # Add check if uri exists
    uri = uri.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = uri
# Add a check for missing database URI if needed, or handle appropriately
if not app.config['SQLALCHEMY_DATABASE_URI']:
    print("Warning: DATABASE_URL environment variable not set.")
    # Handle the absence of a database appropriately, maybe exit or use a default local db for debug
else:
    db = SQLAlchemy(app) # Initialize db only if URI is valid

# Define CORS origins - consider making these environment variables
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:5000",
    "https://web-production-d14cb.up.railway.app", # Your Railway app URL
    "https://vujade.world",
    "http://vujade.world",
    "https://www.vujade.world",
    "http://www.vujade.world"
]
CORS(app, resources={r"/*": {"origins": allowed_origins}})


# --- Add this redirect logic ---
@app.before_request
def handle_redirects():
    """Redirect non-www to www and http to https."""
    if request.endpoint == 'static': # Avoid redirecting static file requests triggered internally
        return

    url_parts = urlparse(request.url)
    host = url_parts.netloc
    scheme = url_parts.scheme

    # Define the canonical target
    target_host = "www.vujade.world"
    target_scheme = "https"

    needs_redirect = False

    # Check if scheme needs changing
    if scheme != target_scheme:
        needs_redirect = True

    # Check if host needs changing (e.g., root domain to www)
    if host != target_host:
        # Only redirect the specific non-www domain we care about
        if host == "vujade.world":
            needs_redirect = True
        # Optional: Redirect the railwayapp domain too?
        # elif host == "web-production-d14cb.up.railway.app":
        #     needs_redirect = True
        # else:
        #     # If it's some other host, maybe don't redirect or handle differently
        #     pass


    if needs_redirect:
        # Reconstruct the URL with the target scheme and host, preserving path and query
        new_url_parts = (target_scheme, target_host, url_parts.path, url_parts.params, url_parts.query, url_parts.fragment)
        new_url = urlunparse(new_url_parts)
        return redirect(new_url, code=301) # Use 301 for permanent redirect

    # If no redirect needed, continue processing the request
    return None
# --- End of redirect logic ---


# Model definitions (only initialize if db is defined)
if 'db' in locals():
    class Video(db.Model):
        __tablename__ = 'videos'
        videoid = db.Column(db.Text(), primary_key=True)
        videoname = db.Column(db.Text(), nullable=False)
        url = db.Column(db.Text(), nullable=False)
        description = db.Column(db.Text(), nullable=True)
        sources = db.Column(db.Text(), nullable=True)
        published = db.Column(db.Date(), nullable=True)
        scenes = db.relationship('Scene', backref='video', lazy=True)

    class Scene(db.Model):
        __tablename__ = 'scenes'
        sceneid = db.Column(db.Integer, primary_key=True)
        videoid = db.Column(db.Text(), db.ForeignKey('videos.videoid'), nullable=False)
        sceneurl = db.Column(db.Text(), nullable=False)
else:
    # Define dummy classes or skip routes that need the DB if it's not configured
    print("Database not configured. Skipping model definitions.")
    # Add fallback behavior for routes that require the DB


# Serve the React application's index.html file for the root path and any other undefined paths
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Redirect logic is now handled by @app.before_request
    # host = request.headers.get("Host", "")
    # if host == "vujade.world":
    #     return redirect(f"https://www.vujade.world/{path}", code=301) # REMOVE THIS

    # Serve static files from React build
    static_file_path = os.path.join(react_build_directory, path)
    if path != "" and os.path.exists(static_file_path):
        # Check if it's a directory, if so serve index.html from it or deny
        if os.path.isdir(static_file_path):
             # Decide behaviour for directories, maybe serve index.html or 404
             # For SPA, usually we want to fall back to root index.html
             return send_from_directory(react_build_directory, 'index.html')
        return send_from_directory(react_build_directory, path)
    # Fallback to serving the main index.html for SPA routing
    return send_from_directory(react_build_directory, 'index.html')


# API route to fetch videos
@app.route('/api/videos')
def get_videos():
    if 'db' not in locals(): return jsonify({"error": "Database not configured"}), 500
    try:
        # Order by 'published' date in descending order
        videos = Video.query.order_by(Video.published.desc()).all()
        return jsonify([{ 'videoID': video.videoid, 'videoName': video.videoname, 'URL': video.url, 'Description': video.description, 'Sources': video.sources, 'Published': video.published.isoformat() if video.published else None, 'Scenes': [{'sceneURL': scene.sceneurl} for scene in video.scenes] } for video in videos])
    except Exception as e:
        print(f"Error in get_videos: {e}")
        return jsonify({"error": str(e)}), 500

# API route to fetch all scenes
@app.route('/api/scenes')
def get_all_scenes():
    """Endpoint to fetch all scenes."""
    if 'db' not in locals(): return jsonify({"error": "Database not configured"}), 500
    try:
        scenes = Scene.query.all()
        return jsonify([{ 'sceneURL': scene.sceneurl, 'videoID': scene.videoid } for scene in scenes])
    except Exception as e:
        print(f"Error in get_all_scenes: {e}")
        return jsonify({"error": str(e)}), 500

# API route to fetch scenes for a specific videoID
@app.route('/api/scenes/<string:videoID>')
def get_scenes(videoID):
    """Endpoint to fetch scenes for a specific videoID."""
    if 'db' not in locals(): return jsonify({"error": "Database not configured"}), 500
    try:
        scenes = Scene.query.filter_by(videoid=videoID).all()
        if scenes:
             return jsonify([{ 'sceneURL': scene.sceneurl, 'videoID': scene.videoid } for scene in scenes])
        else:
             # Return 200 with empty list or 404? Conventionally, 200 OK with empty list is fine.
             # Let's keep 404 as it was, indicates resource lookup failed.
             return jsonify({"message": "No scenes found for this videoID"}), 404
    except Exception as e:
        print(f"Error in get_scenes: {e}")
        return jsonify({"error": str(e)}), 500


# API route to fetch video information by videoID
@app.route('/api/video_info/<string:videoID>')
def get_video_info(videoID):
    if 'db' not in locals(): return jsonify({"error": "Database not configured"}), 500
    try:
        video_info = Video.query.filter_by(videoid=videoID).first()
        if video_info:
            # Ensure date is sent in ISO format
            published_date = video_info.published.isoformat() if video_info.published else None
            video_data = {
                'videoID': video_info.videoid,
                'videoName': video_info.videoname,
                'URL': video_info.url,
                'Description': video_info.description,
                'Sources': video_info.sources,
                'Published': published_date,
                # Ensure scenes related data is correct
                'Scenes': [{'sceneID': scene.sceneid, 'sceneURL': scene.sceneurl, 'videoID': scene.videoid} for scene in video_info.scenes] # Added sceneID and videoID for completeness
            }
            return jsonify(video_data)
        else:
            return jsonify({"message": "Video not found"}), 404
    except Exception as e:
        print(f"Error in get_video_info: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Use PORT environment variable provided by Railway or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # Debug mode should ideally be off in production
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() in ['true', '1', 't']
    # Bind to 0.0.0.0 to be accessible externally
    app.run(debug=debug_mode, host='0.0.0.0', port=port)