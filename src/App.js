import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { useInView } from 'react-intersection-observer';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

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
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;  
    document.body.style.overflow = 'hidden'; // Disable background scrolling

    return () => {
      document.body.style.overflow = originalStyle; // Re-enable background scrolling
    };
  }, []);

  const getEmbeddedVideoUrl = (url) => {
    const vimeoId = url.split("vimeo.com/")[1].split('/')[0];
    return `https://player.vimeo.com/video/${vimeoId}`;
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation(); // Prevent clicks inside the modal from closing it
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
        <div dangerouslySetInnerHTML={{ __html: videoInfo.Description || '' }}></div>
      </div>
    </div>
  );
}

function App({ scenes, uniqueVideoIDs }) {
  const navigate = useNavigate();
  const { videoID } = useParams();
  const [selectedVideoInfo, setSelectedVideoInfo] = useState(null);

  useEffect(() => {
    if (videoID) {
      axios.get(`${BASE_URL}/video_info/${videoID}`)
        .then(response => {
          setSelectedVideoInfo(response.data);
        })
        .catch(error => {
          console.error('Error fetching video info: ', error);
          navigate('/');
        });
    }
  }, [videoID, navigate]);

  const handleVideoNameClick = (id) => {
    navigate(`/videos/${id}`);
  };

  const handleCloseModal = () => {
    setSelectedVideoInfo(null); // Explicitly clear the selected video info
    navigate('/'); // Navigate back to the homepage
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
            onVideoClick={handleVideoNameClick}
          />
        ))}
      </div>
      {selectedVideoInfo && <Modal videoInfo={selectedVideoInfo} onClose={handleCloseModal} />}
    </div>
  );
}

function AppWrapper() {
  const [scenes, setScenes] = useState([]);
  const [uniqueVideoIDs, setUniqueVideoIDs] = useState([]);

  useEffect(() => {
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
        <Route path="/videos/:videoID" element={<App scenes={scenes} uniqueVideoIDs={uniqueVideoIDs} />} />
        <Route path="/" element={<App scenes={scenes} uniqueVideoIDs={uniqueVideoIDs} />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;