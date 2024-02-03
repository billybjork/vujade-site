from flask import Flask, send_from_directory, jsonify
import sqlite3
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
REACT_APP_API_BASE_URL = os.getenv("REACT_APP_API_BASE_URL")

# Initialize Flask app with a reference to the React build folder
app = Flask(__name__, static_folder='../Frontend/build', static_url_path='')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})  # Enable CORS for cross-origin requests

# Define the absolute path to your database
DATABASE_PATH = '/Users/billy/Dropbox (Personal)/VU JA DE/Other/Site Revamp/App/Backend/Videos.db'

def get_db_connection():
    """Helper function to get a database connection."""
    conn = sqlite3.connect(DATABASE_PATH)
    print(f"Connecting to database at {DATABASE_PATH}")
    conn.row_factory = dict_factory
    return conn

def dict_factory(cursor, row):
    """Helper function to format query results as dictionaries."""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

@app.route('/')
def serve():
    """Serve the React frontend."""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/videos')
def get_videos():
    """Endpoint to fetch video data."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Videos")
        videos = cursor.fetchall()
        conn.close()
        return jsonify(videos)
    except Exception as e:
        print(f"Error in get_videos: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/scenes')
def get_all_scenes():
    """Endpoint to fetch all scenes."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Scenes")
        scenes = cursor.fetchall()
        conn.close()
        return jsonify(scenes)
    except Exception as e:
        print(f"Error in get_all_scenes: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/scenes/<string:videoID>')
def get_scenes(videoID):
    """Endpoint to fetch scenes for a specific videoID."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Scenes WHERE videoID = ?", (videoID,))
        scenes = cursor.fetchall()
        conn.close()
        return jsonify(scenes) if scenes else jsonify({"message": "No scenes found for this videoID"}), 404
    except Exception as e:
        print(f"Error in get_scenes: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/video_info/<string:videoID>')
def get_video_info(videoID):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Videos WHERE videoID = ?", (videoID,))
        video_info = cursor.fetchone()
        conn.close()
        if video_info:
            return jsonify(video_info), 200  # Ensure this line is executed when video_info is not None
        else:
            return jsonify({"message": "Video not found"}), 404
    except Exception as e:
        print(f"Error in get_video_info: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
