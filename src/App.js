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
import 'lite-youtube-embed/src/lite-yt-embed.css';
import 'lite-youtube-embed/src/lite-yt-embed.js';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://web-production-d14cb.up.railway.app'
  : 'http://127.0.0.1:5000';

const fadeInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  }
};

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Ensure the GA script has loaded
    if (window.gtag) {
      window.gtag('config', 'G-JTS9LK76J9', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}

function CubeWithVideos({ setCubeLoading, setIsLoadingExternal }) {
  const cubeContainerRef = useRef(null);
  const [cubeVideos, setCubeVideos] = useState([]);
  const cubeMasterInitialized = useRef(false);
  const renderingControl = useRef({ startRendering: null, stopRendering: null });
  const [isLoading, setIsLoading] = useState(true);
  const [, setLoadProgress] = useState(0);  
  const userInteracted = useRef(false);
  const [showFooterInstructions, setShowFooterInstructions] = useState(false);
  const { openModal, closeModal, isModalOpen, currentVideoID } = useModal();
  const location = useLocation(); 

  // Handle user interaction, which hides footer instructions if shown
  const handleUserInteraction = () => {
    if (!userInteracted.current) {
      userInteracted.current = true;
      setShowFooterInstructions(false);
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

  // Initialize the cube once videos and container are ready
  useEffect(() => {
    if (cubeVideos.length === 54 && !cubeMasterInitialized.current && cubeContainerRef.current) {
      const controls = CubeMasterInit(
          cubeVideos, 
          () => {
            setIsLoading(false);
            setCubeLoading(false);
            setIsLoadingExternal(false);
            // Start the instructions timer after the cube has finished loading
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

  // Handle direct navigation to modal URLs
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
          style={{ cursor: isLoading ? 'default' : 'pointer' }}
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
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{ textAlign: 'center', position: 'fixed', bottom: 50, width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '10px' }}
            >
              This is an interactive Rubik’s Cube. Give it a try!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function HeaderMenu({ videos, isLoading, setIsQuestionMarkVisible }) {
  const menuRef = useRef();
  const { openModal, isModalOpen, currentVideoID } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Handles closing the menu if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
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
    if (!isModalOpen && window.location.pathname === '/') {
      openModal(videoId, location);
    }
    setIsOpen(false);
  };

  // Motion variants for menu animation
  const variants = {
    overlay: {
      hidden: { opacity: 0, transition: { duration: 0.3 } },
      visible: { opacity: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, transition: { duration: 0.3, delay: 2 } }
    },
    menuContainer: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.05, duration: 0.1, ease: "easeOut" } }
    },
    menuItem: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { y: { type: 'spring', stiffness: 50, damping: 20 }, opacity: { duration: 0.2 } } }
    }
  };

  // Controls visibility of the hamburger menu button
  const [isMenuButtonVisible, setIsMenuButtonVisible] = useState(false);

  // Updated visibility control for both hamburger and question mark buttons
  useEffect(() => {
    const isVisible = !isLoading && !isModalOpen;
    setIsMenuButtonVisible(isVisible);
    // Ensure the question mark button stays visible as "X" when /about modal is open
    setIsQuestionMarkVisible(currentVideoID === 'about' ? true : isVisible);
  }, [isLoading, isModalOpen, currentVideoID, setIsQuestionMarkVisible]);

  return (
    <div>
      <AnimatePresence>
        <motion.button
          className="hamburger-button"
          onClick={() => setIsOpen(!isOpen)}
          initial="hidden" 
          animate={isMenuButtonVisible ? "visible" : "hidden"} 
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 0.3 }
            }
          }}
        >
          {isOpen ? <MdClose size={40} /> : <MdMenu size={40} />}
        </motion.button>
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="overlay" variants={variants.overlay} initial="hidden" animate="visible" exit="hidden" />
            <motion.div ref={menuRef} className="header-menu" variants={variants.menuContainer} initial="hidden" animate="visible" exit="hidden">
              {videos.map((video) => (
                <motion.button key={video.id} onClick={() => handleVideoClick(video.id)} variants={variants.menuItem} className="video-item">
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

  // Custom Substack widget configuration
  useEffect(() => {
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
    let intervalTime = 50; // Initial interval time in milliseconds

    const updateIntervalTime = () => {
      // Adjust the interval time based on how close we are to the final number
      const fraction = lastNum / 43000000000000000000;
      intervalTime = 100 + (900 * fraction); // Slows down as it approaches the final number
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

    setTimeout(() => {
      clearInterval(interval);
      setDisplayNumber("43,000,000,000,000,000,000"); // Final display number
      setContentVisible(true);
    }, 1800);

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
          ... but only one solution. Which is why this website doesn't aim to <i>solve</i> anything. After all, solutions are rare.
          <br />
          <br />
          <div style={{ transition: 'opacity 2s ease 0.2s', opacity: contentVisible ? 1 : 0 }}>
            <b>VU JA DE</b> exists to scramble the seemingly 'solved' arrangements of internet ephemera. To turn <i>déjà vu</i> into <i style={{ color: '#4e74ff', fontWeight: 'bold' }}>vujà de.</i>
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
        <br />
      </div>
    </div>
  );   
}

function Modal() {
  const { isModalOpen, currentVideoID, closeModal } = useModal(); // [cite: 69]
  const navigate = useNavigate(); // [cite: 69]
  const [videoState, setVideoState] = useState({ info: null, loading: false }); // [cite: 70]
  const modalRef = useRef(null); // [cite: 70]
  const aboutBackdropRef = useRef(null); // [cite: 70]

  // Prevent interactions on body when modal is open
  const handleTouchMove = (e) => { // [cite: 71]
    e.stopPropagation(); // [cite: 71]
    if (isModalOpen) { // [cite: 72]
      e.preventDefault(); // [cite: 72]
    }
  };

  // Fetch video information based on video ID
  useEffect(() => { // [cite: 73]
    async function fetchVideoInfo() {
      if (!currentVideoID || currentVideoID === 'about') return; // [cite: 73]
      setVideoState({ info: null, loading: true }); // [cite: 73]
      try {
        const { data } = await axios.get(`${BASE_URL}/api/video_info/${currentVideoID}`); // [cite: 73]
        setVideoState({ info: data, loading: false }); // [cite: 73]
      } catch (error) {
        console.error('Error fetching video info:', error); // [cite: 73]
        setVideoState({ info: null, loading: false }); // [cite: 74]
      }
    }
    fetchVideoInfo();
  }, [currentVideoID]); // [cite: 74]

  if (!isModalOpen || !currentVideoID) return null; // [cite: 75]

  const modalVariants = { // [cite: 75]
    hidden: { y: '100vh', opacity: 0 }, // [cite: 75]
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 120 } }, // [cite: 75]
    exit: { y: '100vh', opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } } // [cite: 75]
  };

  // Handle the 'about' modal separately
  if (currentVideoID === 'about') { // [cite: 76]
    return (
      <AnimatePresence>
        {isModalOpen && ( // [cite: 76]
          <motion.div
            className="about-modal-backdrop" // [cite: 76]
            ref={aboutBackdropRef} // [cite: 76]
            variants={{
              hidden: { opacity: 0 }, // [cite: 77]
              visible: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }, // [cite: 77]
              exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } } // [cite: 77]
            }}
            initial="hidden" // [cite: 77]
            animate="visible" // [cite: 77]
            exit="exit" // [cite: 78]
            onTouchMove={handleTouchMove} // [cite: 78]
          >
            <motion.div
              className="modal about-modal" // [cite: 78]
              onClick={(e) => e.stopPropagation()} // [cite: 78]
              variants={modalVariants} // Use the same modal variants [cite: 78]
              initial="hidden" // [cite: 79]
              animate="visible" // [cite: 79]
              exit="exit" // [cite: 79]
            >
              <RenderAboutContent />
              <div className="gradient-overlay"></div> {/* [cite: 79] */}
            </motion.div>
          </motion.div>
        )} {/* [cite: 80] */}
      </AnimatePresence>
    );
  } // [cite: 81]

  if (!videoState.info) { // [cite: 81]
     // Handle case where fetching failed or info is null after loading
     return (
       <div className="modal-backdrop"> {/* [cite: 81] */}
         {/* Optionally show a loading spinner or message */}
       </div>
     );
  } // [cite: 82]

  let videoId = null; // [cite: 82]
  try { // [cite: 83]
    const url = new URL(videoState.info.URL); // [cite: 83]
    if (url.hostname === 'www.youtube-nocookie.com') { // [cite: 84] Handle youtube-nocookie used by lite-youtube
      const pathParts = url.pathname.split('/');
      if (pathParts[1] === 'embed') {
          videoId = pathParts[2]; // e.g. /embed/VIDEO_ID
      }
    } else if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com' || url.hostname === 'youtu.be') { // [cite: 85] Handle standard youtube links
       if (url.pathname === '/watch') {
         videoId = url.searchParams.get('v'); // [cite: 85]
       } else if (url.pathname.length > 1) { // Handle youtu.be/VIDEO_ID
         videoId = url.pathname.substring(1);
       }
    } else {
       // Fallback or specific logic if you have other URL types
       console.warn("Could not determine YouTube video ID extraction method for URL:", videoState.info.URL);
       // Attempt to extract from pathname if it looks like an ID (simple heuristic)
       const pathId = url.pathname.substring(1);
       if (pathId && pathId.length === 11) { // Basic check for YouTube ID length
         videoId = pathId;
         console.log("Attempting fallback ID extraction from path:", videoId);
       }
    }

    if (!videoId) { // [cite: 87]
        console.error("Could not extract YouTube video ID from URL:", videoState.info.URL); // [cite: 87]
    }
  } catch (error) { // [cite: 88]
    console.error("Error parsing video URL:", error); // [cite: 88]
  } // [cite: 89]

  return (
    <AnimatePresence>
      {isModalOpen && ( // [cite: 89]
        <motion.div
          className="modal-backdrop" // [cite: 89]
          initial={{ opacity: 0 }} // [cite: 89]
          animate={{ opacity: 1 }} // [cite: 90]
          exit={{ opacity: 0 }} // [cite: 90]
          onClick={() => {
            closeModal(); // [cite: 90]
            navigate('/'); // [cite: 90]
          }}
          onTouchMove={handleTouchMove} // [cite: 90]
        >
          <motion.div
            className="modal" // [cite: 90]
            ref={modalRef} // [cite: 90]
            variants={modalVariants} // [cite: 90]
            initial="hidden" // [cite: 91]
            animate="visible" // [cite: 91]
            exit="exit" // [cite: 91]
            onClick={(e) => e.stopPropagation()} // Prevent closing on click inside the modal [cite: 91]
          >
            <span className="close" onClick={() => { // [cite: 91]
              closeModal(); // [cite: 91]
              navigate('/'); // [cite: 92]
            }}>×</span>

            <div className="embed-container"> {/* [cite: 92] */}
              {videoId ? (
                <lite-youtube
                  key={videoId} // Using videoId as key is good practice
                  videoid={videoId} // Use the extracted videoId
                  playlabel={`Play: ${videoState.info.videoName}`} // Add a play label
                  title={videoState.info.videoName} // Set the title attribute
                  params="controls=1&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&rel=0&playsinline=1" // Pass relevant params
                ></lite-youtube>
              ) : (
                 <p style={{color: 'white', textAlign: 'center', paddingTop: '20%'}}>Video unavailable.</p> // Fallback if ID extraction failed [cite: 95]
              )}
            </div>

            <div className="text-container"> {/* [cite: 95] */}
              <h2>{videoState.info.videoName}</h2> {/* [cite: 95] */}
              <p className="published-date" style={{ fontSize: 'smaller', color: 'gray' }}> {/* [cite: 95] */}
                {formatDate(videoState.info.Published)} {/* [cite: 96] */}
              </p>
              <br></br> {/* [cite: 96] */}
              <div dangerouslySetInnerHTML={{ __html: videoState.info.Description }}></div> {/* [cite: 96] */}
              <br></br> {/* [cite: 96] */}
              <br></br> {/* [cite: 96] */}
              <br></br> {/* [cite: 96] */}
              <br></br> {/* [cite: 96] */}
            </div> {/* [cite: 97] */}
            <div className="gradient-overlay"></div> {/* [cite: 97] */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AppWrapper() {
  const location = useLocation();
  const { openModal, closeModal, isModalOpen, currentVideoID } = useModal();
  const [allVideos, setAllVideos] = useState([]);
  const [cubeLoading, setCubeLoading] = useState(true);
  const [isCloseVisible, setIsCloseVisible] = useState(false);
  const [isQuestionMarkVisible, setIsQuestionMarkVisible] = useState(false);

  usePageTracking(); // Track page views

  const toggleAbout = () => {
    // Toggle the about modal and close button visibility
    if (!isCloseVisible) {
      openModal('about', location);
      setIsCloseVisible(true);
    } else {
      closeModal(location);
      setIsCloseVisible(false);
    }
  }

  useEffect(() => {
    if (location.pathname === '/about' && !isModalOpen) {
      openModal('about');
      setIsQuestionMarkVisible(true); // Ensure it's visible as "X"
    } else if (location.pathname !== '/about' && isModalOpen && currentVideoID === 'about') {
      closeModal();
      setIsQuestionMarkVisible(false);
    }
  }, [location, isModalOpen, currentVideoID, openModal, closeModal]);

  useEffect(() => {
    // Close modal if not on a modal-specific route
    if (location.pathname !== '/about' && !location.pathname.startsWith('/video') && isModalOpen) {
      closeModal();
    }
  }, [location, isModalOpen, closeModal]);

  useEffect(() => {
    // Fetches all video details from Flask API
    const fetchAllVideos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/videos`);
        setAllVideos(response.data.map(video => ({
          id: video.videoID,
          name: video.videoName,
          published: video.Published,
        })));
      } catch (error) {
        console.error('Error fetching all videos:', error);
      }
    };
    fetchAllVideos();
  }, []);

  return (
    <ModalProvider>
      <HeaderMenu videos={allVideos} isLoading={cubeLoading} setIsQuestionMarkVisible={setIsQuestionMarkVisible} />
      <CubeWithVideos setCubeLoading={setCubeLoading} setIsLoadingExternal={setIsQuestionMarkVisible} />
      <AnimatePresence>
        <motion.button
          className={`question-mark-button ${currentVideoID === 'about' ? 'is-close' : ''}`}
          onClick={toggleAbout}
          variants={fadeInVariants}
          initial="hidden"
          animate={isQuestionMarkVisible ? "visible" : "hidden"}
        >
        </motion.button>
      </AnimatePresence>
      <Modal />
    </ModalProvider>
  );  
}

export default AppWrapper;