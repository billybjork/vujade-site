import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMenu, MdClose } from 'react-icons/md';
import { CubeMasterInit } from './cube-master/js/cube/main.js';
import { useModal, ModalProvider } from './ModalContext';
import './App.css';
import { formatDate } from './dateUtils';
import splashCubeGif from './assets/splashcube_small.gif';
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
  const [loadProgress, setLoadProgress] = useState(0);  
  const cubeContainerRef = useRef(null);
  const [showFooterInstructions, setShowFooterInstructions] = useState(false);
  const userInteracted = useRef(false);
  const cubeMasterInitialized = useRef(false);
  const { openModal, closeModal, isModalOpen, currentVideoID } = useModal();
  const location = useLocation(); 

  // Ref to store the rendering functions
  const renderingControl = useRef({ startRendering: null, stopRendering: null });

  // Handle user interaction, which hides footer instructions if shown
  const handleUserInteraction = () => {
    if (!userInteracted.current) {
      userInteracted.current = true;
      setShowFooterInstructions(false);  // This will trigger the exit animation automatically
    }
  };

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
            // Start the timer after the cube has finished loading
            const timer = setTimeout(() => {
              if (!userInteracted.current) {
                setShowFooterInstructions(true);
              }
            }, 3000);

            // Cleanup the timer when the cube is reloaded or component unmounts
            return () => clearTimeout(timer);
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
  
    if (videoID === 'about' && !isModalOpen) {
      openModal('about', location); 
    } else if (
        videoID && 
        videoID !== 'about' && 
        !isModalOpen && 
        window.location.pathname === `/${videoID}` &&
        currentVideoID !== videoID // Check if it is the same video
    ) {
      openModal(videoID, location);
    } else if (!videoID && isModalOpen) {
      closeModal(location);
    }
  }, [location, openModal, closeModal, isModalOpen, currentVideoID]);

  return (
    <>
      {isLoading && (
        <div className="loading">
          <p>Loading...</p>
          <img src={splashCubeGif} alt="Loading..." />
        </div>
      )}
      <div onClick={handleUserInteraction} onTouchStart={handleUserInteraction}>
        <motion.div
          id="cube-container"
          ref={cubeContainerRef}
          initial="hidden"
          animate={isLoading ? "hidden" : "visible"}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: isModalOpen ? 0.2 : 1,
              scale: 1,
              transition: { duration: 0.5 }
            }
          }}
        >
          {/* Cube content here */}
        </motion.div>
        <AnimatePresence>
          {showFooterInstructions && (
            <motion.div
              className="footer-instructions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}  // Ensures the component fades out smoothly
              transition={{ duration: 0.3 }}  // Controls the speed of the fade in/out animation
              style={{ textAlign: 'center', position: 'fixed', bottom: 70, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '10px' }}
            >
              This is an interactive Rubik’s Cube. Give it a try!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function HeaderMenu({ videos, onVideoSelect, isLoading }) {
  const { openModal, isModalOpen } = useModal(); // Get modal context
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();

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
  }, [isOpen]);

  const handleVideoClick = (videoId) => {
    if (!isModalOpen && window.location.pathname === '/') {
      openModal(videoId, location); // Pass location
    }
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

  // Local state to track the menu button's visibility 
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(false);

  // Trigger animation based on isLoading and isModalOpen
  useEffect(() => {
    if (!isLoading && !isModalOpen) { 
      setIsMenuButtonVisible(true); // Show button when not loading and modal is closed
    } else {
      setIsMenuButtonVisible(false); // Hide button when loading or modal is open
    }
  }, [isLoading, isModalOpen]); 

  return (
    <div>
      <AnimatePresence>
        <motion.button
          className="hamburger-button"
          onClick={() => setIsOpen(!isOpen)}
          variants={fadeInVariants}
          initial="hidden" 
          animate={isMenuButtonVisible ? "visible" : "hidden"} 
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
      placeholder: "you@email.com",
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
              <span style={{ color: '#4e74ff' }}>{displayNumber}</span>
              <div style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 1s ease' }}>
              possible combinations...
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <div style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 2s ease' }}>
          ... but only one solution.
          <br />
          <br />
          <div style={{ transition: 'opacity 2s ease 0.2s', opacity: contentVisible ? 1 : 0 }}>
          <p>This website does not <i>solve</i> anything. After all, solutions are rare. <b>VU JA DE</b> exists to scramble the seemingly 'solved' arrangements of internet ephemera. To turn <i>déjà vu</i> into <i style={{ color: '#4e74ff', fontWeight: 'bold' }}>vujà de.</i></p>
        </div>
          <br />
          <div style={{ transition: 'opacity 2s ease 0.4s', opacity: contentVisible ? 1 : 0 }}>
            <p>Like the 43 quintillion permutations of the Rubik's Cube, these stories are starting points, not resolutions. They're not made for an algorithmic feed or a distracted scroll, which is why they come to your email.</p>
          </div>
          <br />
          <br />
          <div className="about-embed" style={{ display: 'flex', justifyContent: 'center', transition: 'opacity 2s ease 0.6s', opacity: contentVisible ? 1 : 0 }}>
            <div id="custom-substack-embed"></div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: 'grey', fontSize: 'small', opacity: contentVisible ? 1 : 0, transition: 'opacity 2s ease 0.8s' }}>
        Rubik's Cube source code:<br></br><a href="https://github.com/KeatonMueller/cube" target="_blank" rel="noopener noreferrer" style={{ color: 'grey' }}>Keaton Mueller</a>
        <br />
        <br />
        (ↄ) VU JA DE
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );  
}

function Modal() {
  const { isModalOpen, currentVideoID, closeModal } = useModal();
  const navigate = useNavigate();
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const modalRef = useRef(null);  // Ref for the regular video modal
  const aboutBackdropRef = useRef(null); // Ref for the About modal backdrop

  // Prevent default to stop scrolling on body when modal is open 
  const handleTouchMove = (e) => {
    e.stopPropagation();
    if (isModalOpen) { 
      e.preventDefault(); 
    }
  };

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
  console.log("Modal render check - isModalOpen:", isModalOpen);
  
  // Motion Variants for the modal backdrop and the modal itself
  const modalBackdropVariants = {
    hidden: { opacity: 0 },
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
          className="about-modal-backdrop"
          ref={aboutBackdropRef}
          variants={modalBackdropVariants} 
          initial="hidden" 
          animate="visible" 
          exit="exit"
        >
          <motion.div 
            className="modal about-modal"
            onClick={(e) => e.stopPropagation()} 
            variants={modalVariants}
            initial="hidden" 
            animate="visible" 
            exit="exit"
          >
            <RenderAboutContent /> 
            <div className="gradient-overlay"></div>
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

  const videoID = videoInfo.URL.split("/")[3];

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div 
          className="modal-backdrop" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            closeModal();
            navigate('/');
          }}
          onTouchMove={handleTouchMove}
        >
          <motion.div 
            className="modal" 
            ref={modalRef}
            variants={modalVariants}
            initial="hidden" 
            animate="visible" 
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent closing on click inside the modal
          >
            <span className="close" onClick={() => { 
              closeModal(); 
              navigate('/');
              setVideoInfo(null); 
            }}>&times;</span>
            {videoInfo && (
              <div className="embed-container">
                <iframe 
                  key={videoInfo.URL.split("/")[3]} 
                  src={`https://player.vimeo.com/video/${videoInfo.URL.split("/")[3]}`} 
                  allow="autoplay; fullscreen" 
                  allowFullScreen 
                  title={videoInfo.videoName}
                ></iframe>
              </div>
            )}
            {videoInfo && (
              <div className="text-container">
                <h2>{videoInfo.videoName}</h2>
                {/* Add the published date below the title, with updated styles */}
                <p className="published-date" style={{ fontSize: 'smaller', color: 'gray' }}>
                  {formatDate(videoInfo.Published)}
                </p> 
                <br></br>
                <div dangerouslySetInnerHTML={{ __html: videoInfo.Description }}></div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </div>
            )}
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
  const [isCloseVisible, setIsCloseVisible] = useState(false);
  const [isQuestionMarkVisible, setIsQuestionMarkVisible] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const toggleAbout = () => {
    if (!isCloseVisible) {
      openModal('about', location);
      // Update state for close button display
      setIsCloseVisible(true);
    } else {
      closeModal(location);
      setIsCloseVisible(false);
    }
  };

  // Updated useEffect for the question mark button visibility
  useEffect(() => {
    const shouldShowQuestionMark = !cubeLoading && (!isModalOpen || (isModalOpen && !isAboutModalOpen));
    setIsQuestionMarkVisible(shouldShowQuestionMark); 
  }, [cubeLoading, isModalOpen, isAboutModalOpen]);

  useEffect(() => {
    if (location.pathname === '/about' && !isModalOpen) {
      openModal('about');
      setIsCloseVisible(true);
    } else if (location.pathname !== '/about' && isModalOpen && currentVideoID === 'about') {
      closeModal();
    }
  }, [location, isModalOpen, currentVideoID, openModal, closeModal]);

  useEffect(() => {
    // If not on a modal route and modal is open, close it
    if (location.pathname !== '/about' && !location.pathname.startsWith('/video') && isModalOpen) {
      closeModal();
    }
  }, [location, isModalOpen, closeModal]);

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
      {/* Pass isLoading to HeaderMenu */}
      {menuVisible && <HeaderMenu videos={allVideos} isLoading={cubeLoading} />} 
      <CubeWithVideos setCubeLoading={setCubeLoading} setIsLoadingExternal={setIsLoading} />
      <AnimatePresence>
        <motion.button
          className={`question-mark-button ${isCloseVisible ? 'is-close' : ''}`}
          onClick={toggleAbout}
          variants={fadeInVariants}
          initial="hidden"
          // Animate based on cubeLoading, same as the hamburger button
          animate={cubeLoading ? "hidden" : "visible"} 
        >
        </motion.button>
      </AnimatePresence>
      <Modal />
    </ModalProvider>
  );  
}

export default AppWrapper;