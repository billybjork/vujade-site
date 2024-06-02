import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { CubeMasterInit } from './cube-master/js/cube/main.js';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useModal, ModalProvider } from './ModalContext';
import _ from 'lodash';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

function CubeWithVideos({ setCubeLoading }) {
  const [cubeVideos, setCubeVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);  // Track loading progress
  const cubeContainerRef = useRef(null);
  const cubeMasterInitialized = useRef(false);
  const { openModal, closeModal, isModalOpen } = useModal();  // Retrieve openModal from context
  const location = useLocation(); // Get current location

  // Ref to store the rendering functions
  const renderingControl = useRef({ startRendering: null, stopRendering: null });

  // Fetch video URLs to be used as textures on the cube
  useEffect(() => {
    const fetchCubeVideos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/scenes`);
        const shuffledScenes = _.shuffle(response.data);
        const first54Videos = shuffledScenes.slice(0, 54).map(scene => scene.sceneURL);
        setCubeVideos(first54Videos);
      } catch (error) {
        console.error('Error fetching cube videos:', error);
      }
    };
    fetchCubeVideos();
  }, []);

  // Initialize the cube once cubeVideos are ready and the container is ready
  useEffect(() => {
    if (cubeVideos.length == 54 && !cubeMasterInitialized.current && cubeContainerRef.current) {
      const controls = CubeMasterInit(
          cubeVideos, 
          () => {
            setIsLoading(false);
            setCubeLoading(false);
          },
          (progress) => { setLoadProgress(progress); },
          cubeContainerRef.current,
          openModal,
          (videoLoadedSuccess) => {
            if (!videoLoadedSuccess) {
                // Handle autoplay failure if needed
            }
        }
      );
      renderingControl.current = controls;
      cubeMasterInitialized.current = true;
    }
  }, [cubeVideos, setCubeLoading, openModal]);

  // Handling the initial loading modal
  useEffect(() => {
    const path = location.pathname;
    const videoID = path.split('/')[1];
    if (videoID && !isModalOpen) {
      console.log('Effect trying to open modal...');
      openModal(videoID);
    } else if (!videoID && isModalOpen) {
      console.log('Effect trying to close modal...');
      closeModal();
    }
  }, [isLoading, location, openModal, closeModal, isModalOpen]);

  return (
    <div id="cube-container" ref={cubeContainerRef} className={isLoading ? 'hidden' : 'visible'}>
      {isLoading ? (
        <div className="loading">{"Loading..."}</div>
      ) : null}
    </div>
  );
}  

function HeaderMenu({ videos, onVideoSelect }) {
  const { openModal } = useModal();

  if (!videos.length) return null;

  const handleVideoClick = (videoId) => {
    console.log("Video selected via menu: ", videoId);
    openModal(videoId);
  };

  return (
    <div className="header-menu">
      {videos.map(video => (
        <button key={video.id} onClick={() => handleVideoClick(video.id)}>
          {video.name}
        </button>
      ))}
    </div>
  );
}

function Modal() {
  const { isModalOpen, currentVideoID, closeModal } = useModal();
  const navigate = useNavigate();
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Local helper to format date
  function formatDate(dateString) {
    if (!dateString) return "[Date not available]"; // Handle undefined or null dates

    const date = new Date(dateString);
    if (isNaN(date)) return "[Invalid Date]"; // Check if the date is valid
  
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const formatted = `${month}, ${year}`;
  
    return `[Published ${formatted}]`;
  }

  // Fetch video information based on currentVideoID
  useEffect(() => {
    async function fetchVideoInfo() {
      if (currentVideoID) {
        setLoading(true);
        try {
          const { data } = await axios.get(`${BASE_URL}/api/video_info/${currentVideoID}`);
          setVideoInfo(data);
        } catch (error) {
          console.error('Error fetching video info:', error);
          setVideoInfo(null);  // Reset video info on error
        }
        setLoading(false);
      }
    }
    fetchVideoInfo();
  }, [currentVideoID]);

  // Handling the case where videoInfo is null or the modal is loading
  if (!isModalOpen || loading) return null;

  // Ensure that videoInfo is available before trying to access the URL
  if (!videoInfo) {
    return (
      <div className="modal-backdrop">
        <div className="loading-container"></div>
      </div>
    );
  }

  // Extract video ID from videoInfo URL
  const videoID = videoInfo.URL.split("/")[3];

  return (
    <div className={`modal-backdrop ${isModalOpen ? 'open' : 'closed'}`} onClick={() => {
      console.log('Backdrop clicked, closing modal...');
      closeModal();
      navigate('/'); // Navigate to root when modal is closed
    }}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <span className="close" onClick={() => {
          console.log('Closing modal...');
          closeModal();
          navigate('/'); // Navigate to root when modal is closed
          setVideoInfo(null); // Reset video information on modal close
        }}>&times;</span>
        <div className="embed-container">
          <iframe
            key={videoID} // Assign key prop to force recreation on ID change
            src={`https://player.vimeo.com/video/${videoID}`}
            allow="autoplay; fullscreen"
            allowFullScreen
            title={videoInfo.videoName}
          ></iframe>
        </div>
        <div className="text-container">
          <h2>{videoInfo.videoName}</h2>
          <br></br>
          <p style={{ fontStyle: 'italic' }}>{formatDate(videoInfo.Published)}</p>
          <br></br>
          <div dangerouslySetInnerHTML={{ __html: videoInfo.Description }}></div>
        </div>
        <div className="gradient-overlay"></div>
      </div>
    </div>
  );
}

function AppWrapper() {
  const { videoID } = useParams();
  const navigate = useNavigate();
  const { openModal, closeModal, isModalOpen } = useModal();

  // State to hold all videos for the header menu
  const [allVideos, setAllVideos] = useState([]);
  
  // State to track if the CubeWithVideos has finished loading
  const [cubeLoading, setCubeLoading] = useState(true);

  // State to trigger re-render of HeaderMenu
  const [menuVisible, setMenuVisible] = useState(true);

  // Function to handle video selection from the menu
  const handleVideoSelect = useCallback((videoId) => {
    console.log("Video selected: ", videoId);
    if (!isModalOpen) {  // Only open modal if not already open
      openModal(videoId);
    }
    navigate(`/${videoId}`, { replace: true }); // Navigate to the video ID
  }, [navigate, openModal, isModalOpen]);

  // Fetch all videos for the header menu
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/videos`);
        setAllVideos(response.data.map(video => ({ id: video.videoID, name: video.videoName })));
      } catch (error) {
        console.error('Error fetching all videos:', error);
      }
    };
    fetchAllVideos();
  }, []);

  // Enhanced closeModal that ensures navigation to the root path
  const closeAndNavigate = useCallback(() => {
    closeModal();
    if (window.location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [closeModal, navigate]);

  // Handle modal states based on URL changes
  useEffect(() => {
    if (videoID) {
      // Check if the modal needs to be opened
      if (!isModalOpen) {
        openModal(videoID);
      }
    } else {
      // When no videoID is present, handle modal states appropriately
      if (isModalOpen) {
        closeAndNavigate();
      }
    }
  }, [videoID, openModal, closeModal, isModalOpen, closeAndNavigate]);

  // Force re-render of HeaderMenu when CubeWithVideos finishes loading
  useEffect(() => {
    if (!cubeLoading) {
      setMenuVisible(false); // Trigger re-render of HeaderMenu
      setTimeout(() => setMenuVisible(true), 0); // Re-show HeaderMenu immediately
    }
  }, [cubeLoading]);

  return (
    <ModalProvider>
      {menuVisible && <HeaderMenu videos={allVideos} onVideoSelect={handleVideoSelect} />}
      <CubeWithVideos setCubeLoading={setCubeLoading} />
      <Routes>
        <Route path="/" element={null} />
        <Route path="/:videoID" element={null} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Modal />
    </ModalProvider>
  );
}

export default AppWrapper;