import os
from flask import Flask, send_from_directory, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from urllib.parse import urlparse, urlunparse
from werkzeug.middleware.proxy_fix import ProxyFix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

react_build_directory = os.path.join(BASE_DIR, 'build')

# Initialize the Flask app with the build directory as the static folder
app = Flask(__name__, static_folder=react_build_directory)

# --- Determine debug mode EARLY and explicitly set app.debug ---
# This ensures app.debug is correct before any potential use.
debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() in ['true', '1', 't']
app.debug = debug_mode  # Explicitly set it based on the environment variable

# --- Conditionally apply ProxyFix ---
if not app.debug:
    # Only apply ProxyFix when NOT in debug mode (i.e., in production)
    # Trust headers from the immediate proxy (Railway)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
    print("--- ProxyFix middleware APPLIED (Production Mode) ---")
else:
    print("--- ProxyFix middleware NOT applied (Debug Mode) ---")


# --- Database Configuration ---
uri = os.environ.get('DATABASE_URL')
if uri and uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = uri

db = None # Initialize db as None
if not app.config['SQLALCHEMY_DATABASE_URI']:
    print("Warning: DATABASE_URL environment variable not set.")
elif app.debug and not app.config['SQLALCHEMY_DATABASE_URI']:
    print("Warning: DATABASE_URL not set in debug mode. DB operations will fail.")
else:
    try:
        db = SQLAlchemy(app)
        print("Database connected via DATABASE_URL.")
    except Exception as e:
        print(f"Error initializing SQLAlchemy: {e}")
        # App might fail later if routes require DB


# --- CORS Configuration ---
# This is crucial for PRODUCTION and potentially allowing local frontend to hit deployed backend (though proxy is preferred for local dev)
allowed_origins = [
    # For React Dev Server (using proxy is better, but keep for fallback/direct testing)
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # For local Flask server (if frontend served directly from Flask port) - unlikely with CRA/Vite
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    # Add the specific port Flask runs on locally if different
    "http://localhost:5001",
    "http://127.0.0.1:5001",
    # Production URLs
    "https://www.vujade.world",  # Primary live domain
    "https://vujade.world",      # Non-www live domain (will be redirected, but allow CORS during transition)
    "https://web-production-d14cb.up.railway.app" # Railway default domain (allow for direct access/testing)
]
# Apply CORS to API routes
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
print(f"CORS configured for origins: {allowed_origins}")

@app.before_request
def handle_redirects():
    """Redirect non-www to www and http to https, ONLY IN PRODUCTION."""

    # --- Use the explicitly set app.debug ---
    if app.debug:
        return None

    # Avoid redirecting static file requests internally if possible
    if request.endpoint == 'static':
       return None

    # In production, ProxyFix should have corrected scheme/host
    current_scheme = request.scheme
    current_host = request.host

    target_host = "www.vujade.world"
    target_scheme = "https"

    scheme_ok = current_scheme == target_scheme
    host_ok = current_host == target_host

    # Determine if a redirect is needed based on scheme or host mismatch
    needs_redirect = False
    log_reason = ""

    # Redirect if scheme is wrong for the target host
    if current_host == target_host and not scheme_ok:
        needs_redirect = True
        log_reason = f"Scheme is wrong ({current_scheme}) for target host ({current_host})"
    # Redirect if host is the specific non-www domain we want to consolidate
    elif current_host == "vujade.world":
        needs_redirect = True
        log_reason = f"Host is non-www ({current_host})"

    if needs_redirect:
        new_url = f"{target_scheme}://{target_host}{request.full_path}"
        print(f"--- Redirecting: {request.url} -> {new_url} (Reason: {log_reason})")
        return redirect(new_url, code=301) # 301 Permanent Redirect

    # If no redirect needed in production
    return None

# --- Model definitions (conditional) ---
if db:
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
    print("--- Database not initialized. Models not defined. API routes needing DB will fail. ---")

# --- Serve React App Route ---
# Catches all non-API routes to serve the frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Check if the request path starts with /api/ - if so, it should be handled by API routes, return 404
    if path.startswith('api/'):
        return jsonify({"error": "API route not found"}), 404

    # Serve static files from the React build directory
    static_file_path = os.path.join(react_build_directory, path)
    if path != "" and os.path.exists(static_file_path) and os.path.isfile(static_file_path):
        # print(f"Serving static file: {path}") # Debug log
        return send_from_directory(react_build_directory, path)

    # Fallback for SPA: serve the main index.html for deep links or 404s handled by React Router
    index_path = os.path.join(react_build_directory, 'index.html')
    if os.path.exists(index_path):
        # print(f"Serving SPA fallback: index.html for path: {path}") # Debug log
        return send_from_directory(react_build_directory, 'index.html')
    else:
        app.logger.error("React build index.html not found at expected path.")
        return jsonify({"error": "Application frontend not found"}), 404

# --- API Routes ---
# Add checks for 'db' before accessing Video or Scene queries

@app.route('/api/videos')
def get_videos():
    if not db: return jsonify({"error": "Database not configured"}), 503
    try:
        videos = Video.query.order_by(Video.published.desc()).all()
        return jsonify([{
            'videoID': video.videoid, 'videoName': video.videoname, 'URL': video.url,
            'Description': video.description, 'Sources': video.sources,
            'Published': video.published.isoformat() if video.published else None,
            'Scenes': [{'sceneURL': scene.sceneurl} for scene in video.scenes]
        } for video in videos])
    except Exception as e:
        app.logger.error(f"Error in get_videos: {e}", exc_info=True)
        return jsonify({"error": "Internal server error retrieving videos"}), 500

@app.route('/api/scenes')
def get_all_scenes():
    if not db: return jsonify({"error": "Database not configured"}), 503
    try:
        scenes = Scene.query.all()
        return jsonify([{ 'sceneURL': scene.sceneurl, 'videoID': scene.videoid } for scene in scenes])
    except Exception as e:
        app.logger.error(f"Error in get_all_scenes: {e}", exc_info=True)
        return jsonify({"error": "Internal server error retrieving scenes"}), 500

@app.route('/api/scenes/<string:videoID>')
def get_scenes(videoID):
    if not db: return jsonify({"error": "Database not configured"}), 503
    try:
        scenes = Scene.query.filter_by(videoid=videoID).all()
        if scenes:
            return jsonify([{ 'sceneURL': scene.sceneurl, 'videoID': scene.videoid } for scene in scenes])
        else:
            # Return 200 OK with an empty list is often preferred over 404 for collections
            return jsonify([]), 200
            # return jsonify({"message": "No scenes found for this videoID"}), 404 # Old behaviour
    except Exception as e:
        app.logger.error(f"Error in get_scenes for {videoID}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error retrieving scenes for video"}), 500

@app.route('/api/video_info/<string:videoID>')
def get_video_info(videoID):
    if not db: return jsonify({"error": "Database not configured"}), 503
    try:
        # Use .options(db.joinedload(Video.scenes)) for potentially better performance if accessing scenes often
        video_info = Video.query.filter_by(videoid=videoID).first()
        if video_info:
            published_date = video_info.published.isoformat() if video_info.published else None
            video_data = {
                'videoID': video_info.videoid,
                'videoName': video_info.videoname,
                'URL': video_info.url,
                'Description': video_info.description,
                'Sources': video_info.sources,
                'Published': published_date,
                'Scenes': [{'sceneID': scene.sceneid, 'sceneURL': scene.sceneurl} for scene in video_info.scenes]
            }
            return jsonify(video_data)
        else:
            return jsonify({"message": "Video not found"}), 404
    except Exception as e:
        app.logger.error(f"Error in get_video_info for {videoID}: {e}", exc_info=True)
        return jsonify({"error": "Internal server error retrieving video info"}), 500

if __name__ == "__main__":
    # --- Confirm debug_mode value right before running ---
    print(f"--- Starting Flask app with debug mode: {app.debug} ---")
    # Use PORT from environment (Railway) or default (e.g., 5001 for local)
    # Ensure this port matches the frontend proxy target if running locally.
    port = int(os.environ.get('PORT', 5001))
    print(f"--- Running on host 0.0.0.0, port {port} ---")
    # app.run will use app.debug internally for reloader/debugger.
    app.run(host='0.0.0.0', port=port)