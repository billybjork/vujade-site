# VU JA DE Interactive Website

This project is a web application featuring an interactive 3D Rubik's Cube showcasing videos from the VU JA DE archive. It combines a Flask backend API with a React frontend. Users can explore videos via the cube or a menu, view details in a modal, and visit an "About" section.

Live at: https://www.vujade.world/

## Features

*   **Interactive 3D Cube:** Displays a manipulable Rubik's Cube textured with video scene thumbnails.
*   **Video Discovery:** Browse videos by interacting with the cube or using the expandable menu.
*   **Video Modal:** Displays detailed video information (title, description, published date) and an embedded YouTube player upon selection.
*   **"About" Section:** Accessible via a dedicated button, featuring custom animations and a Substack embed.
*   **Smooth Animations:** Utilizes Framer Motion for UI transitions and effects.
*   **Routing:** Uses React Router for handling navigation and direct links to videos or the about page.
*   **REST API:** Flask backend provides endpoints to fetch video and scene data from a PostgreSQL database.
*   **Static File Serving:** Flask serves the optimized React build for production.
*   **CORS Enabled:** Configured for development and production environments.
*   **Google Analytics:** Integrated for page view tracking.

## Tech Stack

*   **Backend:**
    *   Python 3.x
    *   Flask
    *   Flask-SQLAlchemy
    *   Flask-CORS
    *   PostgreSQL
    *   Gunicorn (Recommended for production deployment)
*   **Frontend:**
    *   React
    *   JavaScript (ES6+)
    *   HTML5 / CSS3
    *   Axios (for API requests)
    *   React Router DOM
    *   Framer Motion (for animations)
    *   `cube-master` (Custom 3D cube library)
    *   `react-icons`
*   **Database:**
    *   PostgreSQL

## Setup and Installation

**Prerequisites:**

*   Node.js and npm (or yarn)
*   Python 3.x and pip
*   PostgreSQL Server running

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Backend Setup:**
    *   Create and activate a Python virtual environment:
        ```bash
        python -m venv venv
        # On Windows:
        # venv\Scripts\activate
        # On macOS/Linux:
        # source venv/bin/activate
        ```
    *   Install Python dependencies:
        ```bash
        pip install -r requirements.txt
        ```
        *(Note: If `requirements.txt` doesn't exist, create it by running `pip freeze > requirements.txt` after installing Flask, Flask-SQLAlchemy, Flask-Cors, psycopg2-binary, gunicorn etc.)*
    *   Set up your PostgreSQL database and obtain the connection URI.
    *   Set the `DATABASE_URL` environment variable. You can use a `.env` file (with `python-dotenv` package) or set it directly:
        ```bash
        # On macOS/Linux:
        export DATABASE_URL='postgresql://user:password@host:port/database'
        # On Windows CMD:
        set DATABASE_URL='postgresql://user:password@host:port/database'
        # On Windows PowerShell:
        $env:DATABASE_URL='postgresql://user:password@host:port/database'
        ```
        *(Remember to replace `postgres://` with `postgresql://` if needed, as handled in `api.py`)*

3.  **Frontend Setup:**
    *   Navigate to the frontend source directory (e.g., `frontend/`):
        ```bash
        cd frontend
        ```
    *   Install Node.js dependencies:
        ```bash
        npm install
        # or
        yarn install
        ```

## Running the Application

**1. Development:**

*   **Run the Backend (Flask API):**
    *   Make sure your virtual environment is active and `DATABASE_URL` is set.
    *   Navigate to the directory containing `api.py`.
    *   Set Flask to debug mode (optional, for auto-reloading):
        ```bash
        # On macOS/Linux:
        export FLASK_DEBUG=true
        # On Windows CMD:
        set FLASK_DEBUG=true
        # On Windows PowerShell:
        $env:FLASK_DEBUG='true'
        ```
    *   Run the Flask development server:
        ```bash
        python api.py
        ```
        *(The API will likely run on `http://127.0.0.1:5000`)*

*   **Run the Frontend (React Dev Server):**
    *   Navigate to the frontend source directory (e.g., `frontend/`).
    *   Start the React development server:
        ```bash
        npm start
        # or
        yarn start
        ```
        *(The frontend will likely run on `http://localhost:3000` and proxy API requests to Flask)*

    *   Access the application at `http://localhost:3000`.

**2. Production:**

*   **Build the Frontend:**
    *   Navigate to the frontend source directory (e.g., `frontend/`).
    *   Create the optimized production build:
        ```bash
        npm run build
        # or
        yarn build
        ```
        *(This will generate the `build/` directory)*

*   **Run the Backend (Serving Frontend Build):**
    *   Make sure your virtual environment is active and `DATABASE_URL` is set appropriately for production.
    *   Navigate to the directory containing `api.py`.
    *   Run the Flask app using a production-ready WSGI server like Gunicorn:
        ```bash
        gunicorn api:app
        ```
        *(Consult Gunicorn documentation for configuration options like workers, host, and port. Ensure the `build` directory is correctly located relative to `api.py`)*
    *   Alternatively, for simpler setups (like Heroku often handles):
        ```bash
        python api.py
        ```
        *(Ensure `FLASK_DEBUG` is **not** set to `true` in production)*

## API Endpoints

*   `GET /api/videos`: Returns a list of all videos with basic details and associated scenes. Ordered by published date descending.
*   `GET /api/scenes`: Returns a list of all scenes with their associated `videoID`.
*   `GET /api/scenes/<videoID>`: Returns a list of scenes belonging to the specified `videoID`.
*   `GET /api/video_info/<videoID>`: Returns detailed information for a specific video, including its scenes.
*   `GET /`, `GET /<path:path>`: Serves the React application (index.html or specific static assets from the `build` folder).

## Deployment

This application is configured for deployment on platforms like Railway and Heroku:

*   It reads the database configuration from the `DATABASE_URL` environment variable.
*   It uses relative paths for the React build directory.
*   A `Procfile` (not provided, but typical) would likely define the command to start the web server (e.g., `web: gunicorn api:app`).
*   A `runtime.txt` (not provided, but typical) might specify the Python version.