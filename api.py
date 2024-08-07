import os
from flask import Flask, send_from_directory, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Determine the directory containing this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Set the path to the React app's build directory
react_build_directory = os.path.join(BASE_DIR, 'build')

# Initialize the Flask app with the build directory as the static folder
app = Flask(__name__, static_folder=react_build_directory)

uri = os.environ.get('DATABASE_URL')  # or other relevant config var
if uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = uri
db = SQLAlchemy(app)

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:5000", "https://vujade-site-bd6c94750c62.herokuapp.com", "https://vujade.world", "http://vujade.world", "https://www.vujade.world", "http://www.vujade.world"]}})

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# Model definitions
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

# Serve the React application's index.html file for the root path and any other undefined paths
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Attempt to serve the file directly from the static folder, if it exists
    # Otherwise, serve index.html
    if path != "" and os.path.exists(os.path.join(react_build_directory, path)):
        return send_from_directory(react_build_directory, path)
    return send_from_directory(react_build_directory, 'index.html')

# API route to fetch videos
@app.route('/api/videos')
def get_videos():
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
    try:
        scenes = Scene.query.filter_by(videoid=videoID).all()
        return jsonify([{ 'sceneURL': scene.sceneurl, 'videoID': scene.videoid } for scene in scenes]) if scenes else jsonify({"message": "No scenes found for this videoID"}), 404
    except Exception as e:
        print(f"Error in get_scenes: {e}")
        return jsonify({"error": str(e)}), 500

# API route to fetch video information by videoID
@app.route('/api/video_info/<string:videoID>')
def get_video_info(videoID):
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
                'Scenes': [{'sceneID': scene.sceneid, 'sceneURL': scene.sceneurl} for scene in video_info.scenes]
            }
            return jsonify(video_data)
        else:
            return jsonify({"message": "Video not found"}), 404
    except Exception as e:
        print(f"Error in get_video_info: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() in ['true', '1', 't']
    app.run(debug=debug_mode)