import os
from flask import Flask, send_from_directory, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Navigate up two directories to the project root and then to the 'build' directory
react_build_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../build')

app = Flask(__name__, static_folder=react_build_directory, static_url_path='')

uri = os.environ.get('DATABASE_URL')  # or other relevant config var
if uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)
app.config['SQLALCHEMY_DATABASE_URI'] = uri
db = SQLAlchemy(app)

# Configure CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

# Model definitions
class Video(db.Model):
    __tablename__ = 'videos'
    videoid = db.Column(db.Text(), primary_key=True)  # Updated column name
    videoname = db.Column(db.Text(), nullable=False)  # Updated column name
    url = db.Column(db.Text(), nullable=False)  # Updated column name
    description = db.Column(db.Text(), nullable=True)  # Updated column name
    sources = db.Column(db.Text(), nullable=True)  # Updated column name
    scenes = db.relationship('Scene', backref='video', lazy=True)

class Scene(db.Model):
    __tablename__ = 'scenes'
    sceneid = db.Column(db.Integer, primary_key=True)  # Updated column name
    videoid = db.Column(db.Text(), db.ForeignKey('videos.videoid'), nullable=False)  # Updated column name
    sceneurl = db.Column(db.Text(), nullable=False)  # Updated column name

# Serve the React application's index.html file for the root path and any other undefined paths
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(react_build_directory, path)):
        return send_from_directory(react_build_directory, path)
    else:
        return send_from_directory(react_build_directory, 'index.html')

# API route to fetch videos
@app.route('/videos')
def get_videos():
    try:
        videos = Video.query.all()
        return jsonify([{ 'videoID': video.videoid, 'videoName': video.videoname, 'URL': video.url, 'Description': video.description, 'Sources': video.sources, 'Scenes': [{'sceneURL': scene.sceneurl} for scene in video.scenes] } for video in videos])
    except Exception as e:
        print(f"Error in get_videos: {e}")
        return jsonify({"error": str(e)}), 500

# API route to fetch all scenes
@app.route('/scenes')
def get_all_scenes():
    """Endpoint to fetch all scenes."""
    try:
        scenes = Scene.query.all()
        return jsonify([{ 'sceneURL': scene.sceneurl, 'videoID': scene.videoid } for scene in scenes])
    except Exception as e:
        print(f"Error in get_all_scenes: {e}")
        return jsonify({"error": str(e)}), 500

# API route to fetch scenes for a specific videoID
@app.route('/scenes/<string:videoID>')
def get_scenes(videoID):
    """Endpoint to fetch scenes for a specific videoID."""
    try:
        scenes = Scene.query.filter_by(videoid=videoID).all()
        return jsonify([{ 'sceneURL': scene.sceneurl, 'videoID': scene.videoid } for scene in scenes]) if scenes else jsonify({"message": "No scenes found for this videoID"}), 404
    except Exception as e:
        print(f"Error in get_scenes: {e}")
        return jsonify({"error": str(e)}), 500

# API route to fetch video information by videoID
@app.route('/video_info/<string:videoID>')
def get_video_info(videoID):
    try:
        # Fetch the video by videoID
        video_info = Video.query.filter_by(videoid=videoID).first()
        if video_info:
            # Construct the video information, including associated scenes
            video_data = {
                'videoID': video_info.videoid,
                'videoName': video_info.videoname,
                'URL': video_info.url,
                'Description': video_info.description,
                'Sources': video_info.sources,
                'Scenes': [{'sceneID': scene.sceneid, 'sceneURL': scene.sceneurl} for scene in video_info.scenes]
            }
            return jsonify(video_data)
        else:
            return jsonify({"message": "Video not found"}), 404
    except Exception as e:
        print(f"Error in get_video_info: {e}")
        return jsonify({"error": str(e)}), 500

# only for development mode
# if __name__ == '__main__':
    app.run(debug=True)