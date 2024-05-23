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

function CubeWithVideos({ setCubeLoading, onEnterSite }) {
  const [cubeVideos, setCubeVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);  // Track loading progress
  const [showEnterSite, setShowEnterSite] = useState(true);  // State to control visibility of the Enter Site button
  const [showInstructions, setShowInstructions] = useState(true);  // State to control visibility of onscreen instructions
  const cubeContainerRef = useRef(null);
  const cubeMasterInitialized = useRef(false);
  const { openModal, isModalOpen } = useModal();  // Retrieve openModal and isModalOpen from context
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
          () => { setIsLoading(false); setCubeLoading(false); }, 
          (progress) => { setLoadProgress(progress); }, 
          cubeContainerRef.current, 
          openModal
      );
      renderingControl.current = controls;
      cubeMasterInitialized.current = true;
    }
  }, [cubeVideos, setCubeLoading, openModal]);

  // Handling the initial loading modal and visibility of instructions
  useEffect(() => {
    const path = location.pathname;
    const videoID = path.split('/')[1];
    if (videoID && videoID !== '') {
      openModal(videoID);
    }

    // When modal opens, hide instructions permanently for this session
    setShowInstructions(!isModalOpen && showInstructions);
  }, [isLoading, location, openModal, isModalOpen, showInstructions]);  // Added showInstructions as a dependency to maintain its state

  return (
    <div id="cube-container" ref={cubeContainerRef} className={isLoading ? 'hidden' : 'visible'}>
      {showInstructions && (
        <div className="instructions">
          This is an interactive Rubik's Cube.<br /><br />Click a tile to watch the full video.
        </div>
      )}
      {isLoading ? (
        <div className="loading">{"Loading..."}</div>
      ) : showEnterSite && (
        <div className="enter-site-backdrop">
          <button 
            className="enter-site-button" 
            onClick={() => {
              renderingControl.current.startRendering();
              setShowEnterSite(false);
              setShowInstructions(false);
              onEnterSite();  // Notifies that the site entry has occurred, showing the menu
            }}>
            Enter Site
          </button>
        </div>
      )}
    </div>
  );
}

function HeaderMenu({ videos, onVideoSelect }) {
  if (!videos.length) return null;

  return (
    <div className="header-menu visible">
      {videos.map(video => (
        <button key={video.id} onClick={() => onVideoSelect(video.id)}>
          {video.name}
        </button>
      ))}
    </div>
  );
}

function Modal() {
  const { isModalOpen, currentVideoID, closeModal } = useModal();
  const navigate = useNavigate(); // Use navigate to change the URL
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false); // State to handle loading of video information

  console.log(`Modal status: ${isModalOpen}, Video ID: ${currentVideoID}`); // Add this to check state

  // Effect to fetch video information based on currentVideoID
  useEffect(() => {
    async function fetchVideoInfo() {
      if (currentVideoID) {
        setLoading(true); // Start loading
        try {
          const { data } = await axios.get(`${BASE_URL}/api/video_info/${currentVideoID}`);
          setVideoInfo(data); // Set fetched data to videoInfo state
        } catch (error) {
          console.error('Error fetching video info:', error);
          setVideoInfo(null); // Reset video info on error
        }
        setLoading(false); // Stop loading
      }
    }
    fetchVideoInfo();
  }, [currentVideoID]);

  // Handling the case where videoInfo is null
  if (!isModalOpen || loading) return null;  // Display nothing if the modal is closed or loading

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

  // Return modal with conditional rendering based on open/close state
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
          <div dangerouslySetInnerHTML={{ __html: videoInfo.Description }}></div>
        </div>
        <div className="gradient-overlay"></div>  {/* Gradient overlay added here */}
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
  // State to control the visibility of the Header Menu
  const [showMenu, setShowMenu] = useState(false);

  // Use state to track if the CubeWithVideos has finished loading
  const [cubeLoading, setCubeLoading] = useState(true);

  // Function to handle video selection from the menu
  const handleVideoSelect = useCallback((videoId) => {
    openModal(videoId);
    navigate(`/${videoId}`); // Navigate to the selected video
  }, [navigate, openModal]);

  // Fetch all videos for the header menu
  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/videos`); // Endpoint that returns all videos
        setAllVideos(response.data.map(video => ({ id: video.videoID, name: video.videoName })));
      } catch (error) {
        console.error('Error fetching all videos:', error);
      }
    };
    fetchAllVideos();
  }, []);

  // Function to trigger showing the menu when "Enter Site" is clicked in CubeWithVideos
  const handleEnterSite = () => {
    setShowMenu(true);
  };

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

  return (
    <ModalProvider>
      {/* Conditional rendering of the HeaderMenu based on showMenu state */}
      {showMenu && <HeaderMenu videos={allVideos} onVideoSelect={handleVideoSelect} />}

      <CubeWithVideos setCubeLoading={setCubeLoading} onEnterSite={handleEnterSite} />

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