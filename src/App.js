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
  const [contentVisible, setContentVisible] = useState(false);

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
    let lastNum = 0; // Track the last number to ensure it always counts up
    let intervalTime = 50; // Initial interval time in milliseconds, doubled from previous 50ms

    const updateIntervalTime = () => {
      // Adjust the interval time based on how close we are to the final number
      const fraction = lastNum / 43000000000000000000;
      intervalTime = 100 + (900 * fraction); // Slows down more as it approaches the final number
    };

    const interval = setInterval(() => {
      updateIntervalTime(); // Update the interval timing dynamically
      const increment = Math.floor(Math.random() * maxNum) + 1;
      const newNum = Math.min(lastNum + increment, 43000000000000000000);
      const displayNum = newNum.toLocaleString();
      setDisplayNumber(displayNum);
      lastNum = newNum;

      if (maxNum < 1e19) {
        maxNum *= 10; // Gradually increase max range for random number generation
      }

      if (newNum === 43000000000000000000) { // If reached the final number, clear interval
        clearInterval(interval);
      }
    }, intervalTime);

    // Extend the total duration to match the desired length of the animation
    setTimeout(() => {
      clearInterval(interval);
      setDisplayNumber("43,000,000,000,000,000,000"); // Final display number
      setContentVisible(true); // Make the rest of the content visible
    }, 1800); // Increase to 30 seconds for a longer animation

    return () => {
      // Cleanup the script and interval when the component unmounts
      clearInterval(interval);
    };
  }, []);

  return (
    <div id="about-section" className="about-screen">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={splashCubeGif} alt="Splash Cube" />
      </div>
      <br />
      <div className="about-text">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '470px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2em', padding: '0', margin: '0' }}>
          <div style={{ textAlign: 'center', margin: '0', padding: '0', whiteSpace: 'nowrap' }}>
            The Rubik’s Cube has <br />
            <span style={{ color: '#4e74ff' }}>{displayNumber}</span> <br />
            possible combinations...
          </div>
          </div>
        </div>
        <br />
        <br />
        <div style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 2s' }}>
          ... and one solution.
          <br />
          <br />
          <p><b>VU JA DE</b> exists to scramble the “solved” arrangements of internet ephemera. To turn <i>solving</i> into <i>playing.</i> To go from <i>been here before</i> to <i>never seen this before.</i> From <i>déjà vu</i> to <i>vujà de.</i></p>
          <br />
          <p>Like the 43 quintillion permutations of the Rubik's Cube, these stories are starting points, not resolutions. They're not made for an algorithmic feed or a distracted scroll, which is why they come to your email.</p>
          <br />
          <br />
          <div className="about-embed" style={{ display: 'flex', justifyContent: 'center' }}>
            <div id="custom-substack-embed"></div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
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
    }
    fetchVideoInfo();
  }, [currentVideoID]);

  if (!isModalOpen || loading || !currentVideoID) return null;
  
  // Motion Variants for the modal backdrop and the modal itself
  const modalBackdropVariants = {
    hidden: { opacity: 0 }, // Start invisible
    visible: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const modalVariants = {
    hidden: { y: '100vh', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 120 } },
    exit: { y: '100vh', opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } }
  };

  if (currentVideoID === 'about') {
    return (
      <AnimatePresence>
        <motion.div
          className="about-modal-backdrop" // Added class about-modal-backdrop for styling
          variants={modalBackdropVariants} 
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => { 
            closeModal();
            navigate('/'); 
          }}
        >
          <motion.div 
            className="modal"
            onClick={e => e.stopPropagation()} // Prevent click from propagating to backdrop
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 100 }} 
          >
            <RenderAboutContent />
          </motion.div>
        </motion.div>
      </AnimatePresence>
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

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div // Added the modalBackdropVariants for transitions
          className="modal-backdrop" 
          variants={modalBackdropVariants} 
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => {
            closeModal();
            navigate('/'); // Navigate to root when modal is closed
          }}
        >
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
              navigate('/');
              setVideoInfo(null); // Reset video information on modal close 
            }}>
              &times;
            </span>

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
          </motion.div>
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
  const [isCloseVisible, setIsCloseVisible] = useState(false); // State to manage button appearance

  const toggleAbout = () => {
    if (!isCloseVisible) {
      openModal('about');
      navigate('/about');
      setIsCloseVisible(true); // Change button to "X"
    } else {
      closeModal();
      navigate('/');
      setIsCloseVisible(false); // Change button to "?"
    }
  };

  useEffect(() => {
    if (location.pathname === '/about' && !isModalOpen) {
      openModal('about');
      setIsCloseVisible(true); // Ensure button is "X" when modal is open
    } else if (location.pathname !== '/about' && isModalOpen && currentVideoID !== 'about') {
      closeModal();
      setIsCloseVisible(false); // Change button to "?"
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
          className={`question-mark-button ${isCloseVisible ? 'is-close' : ''}`}
          onClick={toggleAbout}
          variants={fadeInVariants}
          initial="hidden"
          animate={(!isModalOpen || currentVideoID === 'about') ? "visible" : "hidden"}
        >
        </motion.button>
      </AnimatePresence>
      <Modal />
    </ModalProvider>
  );  
}

export default AppWrapper;