import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import axios from 'axios';
import './App.css';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { MdMenu, MdClose } from 'react-icons/md';
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

    // Handle 'about' modal separately
    if (videoID === 'about') {
        if (!isModalOpen) openModal('about');
    } else if (videoID && videoID !== 'about' && !isModalOpen) {
        // Handle video modals
        openModal(videoID);
    } else if (!videoID && isModalOpen) {
        // Close modal when no videoID or 'about' is in the path
        closeModal();
    }
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
  const { openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // New state to manage transition
  const menuRef = useRef(); // Reference to the menu DOM node

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsTransitioning(false); // Immediately remove overlay when clicking outside
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleVideoClick = (videoId) => {
    openModal(videoId);
    setIsTransitioning(true); // Start transition
    setTimeout(() => {
      setIsOpen(false);
      setIsTransitioning(false); // End transition after 2 seconds
    }, 2000);
  };

  // Adjusted variants to consider `isTransitioning`
  const overlayVariants = {
    hidden: { 
      opacity: 0,
      transition: { duration: 0.3 }
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div>
      <button className="hamburger-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <MdClose size={40} /> : <MdMenu size={40} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(isOpen || isTransitioning) && (
          <motion.div
            ref={menuRef}
            className="header-menu"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {videos.map((video, index) => (
              <motion.button
                key={video.id}
                onClick={() => handleVideoClick(video.id)}
              >
                {video.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RenderAboutContent() {
  return (
    <div id="about-section" className="about-screen">
      <div className="about-screen">
          <div className="about-text">
             <p style={{ textAlign: 'center' }}>
            </p>
            <p>
              The Rubik’s Cube has 43,000,000,000,000,000,000 possible combinations... and <i>one</i> solution.
            </p>
            <br></br>
            <p>
              It's easy to appreciate the puzzle in its solved form: a universe of possibility reduced to six harmonic faces. But <i>leaving</i> it solved would squander all that potential.
            </p>
            <br></br>
            <p>
              <b>VU JA DE</b> exists to scramble “solved” arrangements of cultural ephemera. To flip the switch from <i style={{ color: 'blue' }}>solving</i> to <i style={{ color: 'blue' }}>playing.</i> From <i style={{ color: 'blue' }}>I've been here before</i> to <i style={{ color: 'blue' }}>I've never seen this before.</i> From <i style={{ color: 'blue' }}>déjà vu</i> to <i style={{ color: 'blue' }}>vujà de.</i>
            </p>
            <br></br>
            <p>
              Like the 43 quintillion permutations of the Rubik's Cube, these stories are starting points, not resolutions. They're not made for an algorithmic feed or a distracted scroll, which is why they come to your email. Explore on your own time, at your own pace, with nobody trying to sell you something in the process.
            </p>
            <br></br>
            <div className="about-embed" style={{ display: 'flex', justifyContent: 'center' }}>
            <iframe
            src="https://vujadeworld.substack.com/embed"
            width="480"
            height="150"
            style={{ border: '0px solid #EEE', background: 'black' }}
            title="VUJADE Substack"
          ></iframe>
          </div>
          </div>
      </div>
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
    return `[Published ${month}, ${year}]`;
  }

  // Fetch video information based on currentVideoID
  useEffect(() => {
    async function fetchVideoInfo() {
      if (currentVideoID && currentVideoID !== 'about') {
        setLoading(true);
        setVideoInfo(null); // Reset video info when a new modal is being opened
        try {
          const { data } = await axios.get(`${BASE_URL}/api/video_info/${currentVideoID}`);
          setVideoInfo(data);
        } catch (error) {
          console.error('Error fetching video info:', error);
          setVideoInfo(null); // Reset video info on error
        }
        setLoading(false);
      }
    };
    fetchVideoInfo();
  }, [currentVideoID]);
  
  if (!isModalOpen || loading || !currentVideoID) return null;

  if (currentVideoID === 'about') {
    return (
      <div className="about-modal" onClick={() => {
        closeModal();
        navigate('/');
      }}>
        <motion.div
          className="about-screen"
          onClick={e => e.stopPropagation()} // Prevent click from propagating to backdrop
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <RenderAboutContent />
        </motion.div>
      </div>
    );
  }

  if (!videoInfo) {
    return (
      <div className="modal-backdrop">
        <div className="loading-container"></div>
      </div>
    );
  }

  const videoID = videoInfo.URL.split("/")[3]; // Extract video ID from videoInfo URL

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
          closeModal();
          navigate('/'); // Navigate to root when modal is closed
        }}>
          <motion.div
            className="modal"
            onClick={e => e.stopPropagation()} // Prevent click from propagating to backdrop
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <span className="close" onClick={() => {
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
              <br />
              <p style={{ fontStyle: 'italic' }}>{formatDate(videoInfo.Published)}</p>
              <br />
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
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal, closeModal, isModalOpen, currentVideoID } = useModal();
  const [allVideos, setAllVideos] = useState([]);
  const [cubeLoading, setCubeLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(true);

  // This function toggles the About modal and updates the URL accordingly
  const toggleAbout = () => {
    if (currentVideoID !== 'about') {
      openModal('about');  // Open About modal if not currently about
      navigate('/about');  // Navigate to /about when opening the modal
    } else {
      closeModal();  // Close the modal
      navigate('/');  // Navigate to root when closing the modal
    }
  };

  useEffect(() => {
    if (location.pathname === '/about' && !isModalOpen) {
      openModal('about');  // Open About modal if URL is /about but modal isn't open
    } else if (location.pathname !== '/about' && isModalOpen && currentVideoID === 'about') {
      closeModal();  // Close any modal if URL is not /about but a modal is still open
    }
  }, [location, isModalOpen, currentVideoID, openModal, closeModal]);

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

  const handleVideoSelect = useCallback((videoId) => {
    if (!isModalOpen) {
      openModal(videoId);
    }
    navigate(`/${videoId}`, { replace: true });
  }, [navigate, openModal, isModalOpen]);

  return (
    <ModalProvider>
      {menuVisible && <HeaderMenu videos={allVideos} onVideoSelect={handleVideoSelect} />}
      <CubeWithVideos setCubeLoading={setCubeLoading} />
      <button
        className={`question-mark-button ${currentVideoID === 'about' ? 'x-style' : ''}`} // Change style and text based on the modal state
        onClick={toggleAbout}
      >
        {currentVideoID === 'about' ? 'X' : '?'}
      </button>
      <Modal />
    </ModalProvider>
  );
}

export default AppWrapper;