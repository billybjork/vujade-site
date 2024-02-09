import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { useInView } from 'react-intersection-observer';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

// Ensure BASE_URL is defined using the environment variable or fallback to a default
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';

function Video({ src, videoID, onVideoClick }) {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px 0px',
  });

  const handleMouseEnter = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Handle interrupted play request here
          console.error("Play was interrupted.", error);
        });
      }
    }
  };  

  const handleMouseLeave = () => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  };

  return (
    <div ref={ref} style={{ width: '100%', height: 'auto' }}>
      {inView && (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          onClick={() => onVideoClick(videoID)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ width: '100%', height: 'auto' }}
        />
      )}
    </div>
  );
}

function Modal({ videoInfo, onClose }) {
  const getEmbeddedVideoUrl = (url) => {
    const vimeoId = url.split("vimeo.com/")[1].split('/')[0];
    return `https://player.vimeo.com/video/${vimeoId}`;
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{videoInfo.videoName}</h2>
        <div className="embed-container">
          <iframe
            src={getEmbeddedVideoUrl(videoInfo.URL)}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={videoInfo.videoName}
          ></iframe>
        </div>
        <p style={{ whiteSpace: 'pre-wrap' }}>{videoInfo.Description || ''}</p>
      </div>
    </div>
  );
}

function App({ scenes, uniqueVideoIDs, selectedVideoInfo, setSelectedVideoInfo }) {
  const navigate = useNavigate();

  const handleVideoNameClick = (videoID) => {
    setSelectedVideoInfo(null); // Clear any previous video info
    // Fetch detailed video information using the correct relative endpoint
    axios.get(`${BASE_URL}/video_info/${videoID}`)
      .then(response => {
        setSelectedVideoInfo(response.data);
        navigate(`/videos/${videoID}`);
      })
      .catch(error => {
        console.error('Error fetching video info: ', error);
      });
  };

  const handleCloseModal = () => {
    setSelectedVideoInfo(null);
    navigate('/');
  };

  return (
    <div className="App">
      <div className="video-menu">
        {uniqueVideoIDs.map(({ videoID, videoName }) => (
          <div key={videoID} onClick={() => handleVideoNameClick(videoID)}>
            {videoName}
          </div>
        ))}
      </div>
      <div className="video-grid">
        {scenes.map(scene => (
          <Video
            key={scene.sceneURL}
            src={scene.sceneURL}
            videoID={scene.videoID}
            onVideoClick={() => handleVideoNameClick(scene.videoID)}
          />
        ))}
      </div>
      {selectedVideoInfo && <Modal videoInfo={selectedVideoInfo} onClose={handleCloseModal} />}
    </div>
  );
}

function AppWrapper() {
  const [scenes, setScenes] = useState([]);
  const [selectedVideoInfo, setSelectedVideoInfo] = useState(null);
  const [uniqueVideoIDs, setUniqueVideoIDs] = useState([]);

  useEffect(() => {
    // Fetch scenes and unique video IDs
    axios.get(`${BASE_URL}/scenes`)
      .then(response => {
        setScenes(shuffleArray(response.data));
      })
      .catch(error => {
        console.error('Error fetching scenes: ', error);
      });

    axios.get(`${BASE_URL}/videos`)
      .then(response => {
        setUniqueVideoIDs(response.data);
      })
      .catch(error => {
        console.error('Error fetching videos: ', error);
      });
  }, []);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/videos/:videoID"
          element={<App
            scenes={scenes}
            uniqueVideoIDs={uniqueVideoIDs}
            selectedVideoInfo={selectedVideoInfo}
            setSelectedVideoInfo={setSelectedVideoInfo}
          />}
        />
        <Route
          path="/"
          element={<App
            scenes={scenes}
            uniqueVideoIDs={uniqueVideoIDs}
            selectedVideoInfo={selectedVideoInfo}
            setSelectedVideoInfo={setSelectedVideoInfo}
          />}
        />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
