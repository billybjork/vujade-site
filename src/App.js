import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { useInView } from 'react-intersection-observer';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const Video = ({ src, videoID, onVideoClick }) => {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger this once per component instance
    rootMargin: '50px 0px', // Load the video slightly before it comes into view
  });

  // Play video on hover
  const handleMouseEnter = () => {
    if (videoRef.current) videoRef.current.play();
  };

  // Pause video on mouse leave
  const handleMouseLeave = () => {
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <div ref={ref} style={{ width: '100%', height: 'auto' }}> {/* Use the ref from useInView */}
      {inView && ( // Only render the video tag if the component is in view
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          onClick={() => onVideoClick(videoID)}
          onMouseEnter={handleMouseEnter} // Play on hover
          onMouseLeave={handleMouseLeave} // Pause on leave
          style={{ width: '100%', height: 'auto' }} // Ensure video fills its container
        />
      )}
    </div>
  );
};

const Modal = ({ videoInfo, onClose }) => {
  // Function to extract the Vimeo ID and return the embed URL
  const getEmbeddedVideoUrl = (url) => {
    const vimeoId = url.split("vimeo.com/")[1].split('/')[0];
    return `https://player.vimeo.com/video/${vimeoId}`;
  };

  // Function to stop propagation for clicks inside the modal content
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{videoInfo.videoName}</h2>
        {/* Responsive embed container */}
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
};

function App() {
  const [scenes, setScenes] = useState([]);
  const [selectedVideoInfo, setSelectedVideoInfo] = useState(null);
  const navigate = useNavigate();
  const [uniqueVideoIDs, setUniqueVideoIDs] = useState([]);

  useEffect(() => {
    // Fetch scenes
    axios.get('https://fierce-springs-10022-1e7f8f8c4e94.herokuapp.com/scenes')
      .then(response => {
        setScenes(shuffleArray(response.data)); // Assuming this endpoint returns all scenes
      })
      .catch(error => {
        console.error('Error fetching scenes: ', error);
      });
  
    // Fetch videos for menu
    axios.get('https://fierce-springs-10022-1e7f8f8c4e94.herokuapp.com/videos')
      .then(response => {
        // Directly use the response data if it correctly provides unique video IDs and names
        setUniqueVideoIDs(response.data); // Assuming this endpoint returns unique videos
      })
      .catch(error => {
        console.error('Error fetching videos: ', error);
      });
  }, []); // Empty dependency array ensures this runs only once on mount  

  const handleVideoNameClick = (videoID) => {
    // Fetch detailed video information using the updated endpoint
    axios.get(`https://fierce-springs-10022-1e7f8f8c4e94.herokuapp.com/video_info/${videoID}`)
      .then(response => {
        // Ensure response.data contains the video info, including URL
        setSelectedVideoInfo(response.data);
        navigate(`/videos/${videoID}`);
      })
      .catch(error => {
        console.error('Error fetching video info: ', error);
      });
  };


  // Moved handleCloseModal function inside the App function
  const handleCloseModal = () => {
    setSelectedVideoInfo(null);
    navigate('/');
  };

  // Removed the duplicated return statement and combined the functionality
  return (
    <div className="App">
      <div className="video-menu">
        {uniqueVideoIDs.map(({ videoID, videoName }) => (
          <div key={videoID} onClick={() => handleVideoNameClick(videoID)}>
            {videoName} {/* This now correctly references videoName for display */}
          </div>
        ))}
      </div>
      <div className="video-grid">
        {scenes.map(scene => (
          <Video
            key={scene.sceneURL}
            src={scene.sceneURL}
            videoID={scene.videoID}
            onVideoClick={() => handleVideoNameClick(scene.videoID)} // Adjusted to use handleVideoNameClick
          />
        ))}
      </div>
      {selectedVideoInfo && <Modal videoInfo={selectedVideoInfo} onClose={handleCloseModal} />}
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/videos/:videoID" element={<App />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
