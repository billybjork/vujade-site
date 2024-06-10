import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import axios from 'axios';
import './App.css';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { MdMenu, MdClose } from 'react-icons/md';
import { CubeMasterInit } from './cube-master/js/cube/main.js';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useModal, ModalProvider } from './ModalContext';
import splashCubeGif from './assets/splashcube_small.gif';
import { formatDate } from './dateUtils';
import _ from 'lodash';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

const fadeInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95  // Start slightly scaled down for a more dynamic entrance
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,  // Adjust the timing to your liking
      ease: "easeInOut"
    }
  }
};  

function CubeWithVideos({ setCubeLoading, setIsLoadingExternal }) {
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
            setIsLoadingExternal(false);
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
  }, [cubeVideos, setCubeLoading, openModal, setIsLoadingExternal]);

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
  <>
    {isLoading && (
      <div className="loading">
          <p>Loading...</p>  {/* Dynamic text reflecting the loading progress */}
          <img src={splashCubeGif} alt="Loading..." />
      </div>
    )}
    <motion.div
        id="cube-container"
        ref={cubeContainerRef}
        initial={{ opacity: 0 }}  // Start with an invisible container
        animate={{ opacity: isLoading ? 0 : 1 }}  // Animate to visible when loading is complete
        transition={{ duration: 0.5 }}
    >
        {/* Cube content here */}
    </motion.div>
  </>
);
}

function HeaderMenu({ videos, onVideoSelect, isLoading }) {
  const { openModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(); // Reference to the menu DOM node

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false); // Close the menu if the click is outside
      }
    };

    if (isOpen) {
      // Add when the menu is open
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      // Clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Effect dependencies include isOpen

  if (!videos.length) return null;

  const handleVideoClick = (videoId) => {
    openModal(videoId);
    setIsOpen(false);
  };

  // Define motion variants for animation
  const overlayVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.3 }
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, delay: 2 }  // Delaying the fade-out process
    }
  };

  const menuContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
        duration: 0.1,
        ease: "easeOut"
      }
    }
  };

  const menuItemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        y: { type: 'spring', stiffness: 50, damping: 20 },
        opacity: { duration: 0.2 }
      }
    }
  };

  return (
    <div>
      <AnimatePresence>
        <motion.button
          className="hamburger-button"
          onClick={() => setIsOpen(!isOpen)}
          variants={fadeInVariants}
          initial="hidden"
          animate={isLoading ? "hidden" : "visible"}  // Control animation based on isLoading
        >
          {isOpen ? <MdClose size={40} /> : <MdMenu size={40} />}
        </motion.button>
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />
            <motion.div
              ref={menuRef}
              className="header-menu"
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
            {videos.map((video) => (
              <motion.button
                key={video.id}
                variants={menuItemVariants}
                onClick={() => handleVideoClick(video.id)}
                className="video-item"
              >
                <span className="video-name">{video.name}</span>
                <span className="separator"> | </span>
                <div className="video-date">
                  <span className="video-month">{formatDate(video.published).split(',')[0]},</span>
                  <span className="video-year">{formatDate(video.published).split(',')[1]}</span>
                </div>
              </motion.button>
            ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function RenderAboutContent() {
  const [displayNumber, setDisplayNumber] = useState('0');

  useEffect(() => {
    // Define the widget configuration
    window.CustomSubstackWidget = {
      substackUrl: "vujadeworld.substack.com",
      placeholder: "example@gmail.com",
      buttonText: "Subscribe",
      theme: "custom",
      colors: {
        primary: "#FFFFFF",
        input: "#000000",
        email: "#FFFFFF",
        text: "#000000"
      }
    };

    // Create the script element for the Substack widget
    const script = document.createElement('script');
    script.src = 'https://substackapi.com/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Start the simulated counting animation
    let maxNum = 1; // Start with smaller numbers
    const interval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * maxNum).toLocaleString();
      setDisplayNumber(randomNum);
      maxNum *= 10; // Increase max range for random number generation
      if (maxNum > 1e19) maxNum = 1e19; // Cap maxNum to avoid going over the intended final number
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setDisplayNumber("43,000,000,000,000,000,000"); // Final display number
    }, 2000);

    return () => {
      // Cleanup the script and interval when the component unmounts
      document.body.removeChild(script);
      clearInterval(interval);
    };
  }, []);

  return (
    <div id="about-section" className="about-screen">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={splashCubeGif} alt="Splash Cube" />
      </div>
      <br></br>
      <div className="about-text">
        <p className="headline">
          The Rubik’s Cube has <span style={{ color: '#4e74ff' }}>{displayNumber}</span> <br></br>possible combinations... and one solution.
        </p>
        <br />
        <p><b>VU JA DE</b> exists to scramble “solved” arrangements of cultural ephemera. To flip the switch from <i>solving</i> to <i>playing.</i> From <i>I've been here before</i> to <i>I've never seen this before.</i> From <i>déjà vu</i> to <i>vujà de.</i></p>
        <br />
        <p>Like the 43 quintillion permutations of the Rubik's Cube, these stories are starting points, not resolutions. They're not made for an algorithmic feed or a distracted scroll, which is why they come to your email. Explore on your own time, at your own pace, with nobody trying to sell you something in the process.</p>
        <br></br>
        <br />
        <div className="about-embed" style={{ display: 'flex', justifyContent: 'center' }}>
          <div id="custom-substack-embed"></div>
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
  const { openModal, closeModal, isModalOpen, currentVideoID, overlayVisible } = useModal();
  const [allVideos, setAllVideos] = useState([]);
  const [cubeLoading, setCubeLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
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
        setAllVideos(response.data.map(video => ({
          id: video.videoID,
          name: video.videoName,
          published: video.Published, // Ensure this matches your API response
        })));
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
      {menuVisible && <HeaderMenu videos={allVideos} isLoading={isLoading} />}
      <CubeWithVideos setCubeLoading={setCubeLoading} setIsLoadingExternal={setIsLoading} />
      {overlayVisible && (
        <div className="overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
        }}></div>
      )}
      <AnimatePresence>
        <motion.button
          className={`question-mark-button ${currentVideoID === 'about' ? 'x-style' : ''}`}
          onClick={toggleAbout}
          variants={fadeInVariants}
          initial="hidden"
          animate={isLoading ? "hidden" : "visible"}  // Animate based on isLoading
        >
          {currentVideoID === 'about' ? 'X' : '?'}
        </motion.button>
      </AnimatePresence>
      <Modal />
    </ModalProvider>
  );  
}

export default AppWrapper;