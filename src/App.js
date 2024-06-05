import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import axios from 'axios';
import './App.css';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { MdMenu, MdClose } from 'react-icons/md';
import { CubeMasterInit } from './cube-master/js/cube/main.js';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useModal, ModalProvider } from './ModalContext';
import SplashScreen from './About';
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
  
    // Check if the path is valid for opening a modal
    const shouldOpenModal = videoID && !isModalOpen;
    const shouldCloseModal = (!videoID) && isModalOpen;
  
    if (shouldOpenModal) {
      console.log('Effect trying to open modal...');
      openModal(videoID);
    } else if (shouldCloseModal) {
      console.log('Effect trying to close modal...');
      closeModal();
    }
  
    // Cleanup function to ensure no unintended side effects
    return () => {
      if (isModalOpen) {
        closeModal();
      }
    };
  }, [location, openModal, closeModal, isModalOpen]);  

  return (
    <motion.div
        id="cube-container"
        ref={cubeContainerRef}
        className={isLoading ? 'hidden' : 'visible'}
        animate={{ opacity: isModalOpen ? 0.3 : 1 }} // Fades to 30% opacity when modal is open
        transition={{ duration: 0.5 }} // Duration of the transition
    >
        {isLoading ? (
            <div className="loading">{"Loading..."}</div>
        ) : null}
    </motion.div>
  );
}

function HeaderMenu({ videos, onVideoSelect }) {
  const { openModal, isModalOpen } = useModal();
  const [isOpen, setIsOpen] = useState(false); // State to manage menu visibility

  if (!videos.length) return null;

  const handleVideoClick = (videoId) => {
    console.log("Video selected via menu: ", videoId);
    openModal(videoId);
    setIsOpen(false); // Close menu upon selection
  };

  // Variants for the menu container
  const menuContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between animations of each child
      }
    }
  };

  // Variants for individual menu items
  const menuItemVariants = {
    hidden: {
      y: -20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    }
  };

  return (
    <motion.div>
        <button className="hamburger-button" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <MdClose size={40} /> : <MdMenu size={40} />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="header-menu"
                    variants={menuContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {videos.map((video, index) => (
                        <motion.button
                            key={video.id}
                            variants={menuItemVariants}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleVideoClick(video.id)}
                        >
                            {video.name}
                        </motion.button>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
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
        setVideoInfo(null);  // Reset video info when a new modal is being opened
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
  

  if (!isModalOpen || loading || !currentVideoID) return null;

  if (!videoInfo) {
    return (
      <div className="modal-backdrop">
        <div className="loading-container"></div>
      </div>
    );
  }

  const videoID = videoInfo.URL.split("/")[3]; // Extract video ID from videoInfo URL

  // Variants for modal animations
  const modalVariants = {
    hidden: {
      y: '100vh',
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 120
      }
    },
    exit: {
      y: '100vh',
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => {
          console.log('Backdrop clicked, closing modal...');
          closeModal();
          navigate('/'); // Navigate to root when modal is closed
        }}>
          <motion.div
            className="modal"
            onClick={e => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function AppWrapper() {
  const { videoID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal, closeModal, isModalOpen } = useModal();
  const aboutSectionRef = useRef(null);

  const [allVideos, setAllVideos] = useState([]);
  const [cubeLoading, setCubeLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false); // Controls preview text visibility
  const [fadeOut, setFadeOut] = useState(false); // Controls fade out effect

  // Handle scrolling to the About page
  useLayoutEffect(() => {
    const handleScroll = () => {
      const aboutSectionTop = aboutSectionRef.current.offsetTop;
      const scrollPosition = window.scrollY + window.innerHeight;

      if (scrollPosition > aboutSectionTop) {
        setFadeOut(true);
      } else {
        setFadeOut(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  // Function to handle video selection from the menu
  const handleVideoSelect = useCallback((videoId) => {
    console.log("Video selected: ", videoId);
    if (!isModalOpen) {  // Only open modal if not already open
      openModal(videoId);
    }
    navigate(`/${videoId}`, { replace: true }); // Navigate to the video ID
  }, [navigate, openModal, isModalOpen]);

  // Show and hide preview text on hover or click
  const handlePreviewToggle = () => {
    setPreviewVisible(!previewVisible);
  };

  return (
    <ModalProvider>
      {menuVisible && <HeaderMenu videos={allVideos} onVideoSelect={handleVideoSelect} />}
      <CubeWithVideos setCubeLoading={setCubeLoading} />
      <button
        className={`question-mark-button ${fadeOut ? 'fade-out' : ''}`}
        onMouseEnter={() => setPreviewVisible(true)} // For desktop
        onMouseLeave={() => setPreviewVisible(false)} // For desktop
        onClick={handlePreviewToggle} // For mobile
      >
        ?
      </button>
      {previewVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`preview-text ${fadeOut ? 'fade-out' : ''}`}
        >
          This is an interactive Rubik's Cube.<br></br><br></br>Scroll down to learn more 👇
        </motion.div>
      )}
      <div ref={aboutSectionRef}>
        <SplashScreen />
      </div>
      <Modal />
    </ModalProvider>
  );
}

export default AppWrapper;