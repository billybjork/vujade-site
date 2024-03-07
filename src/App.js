import React, { useState, useEffect, Suspense, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import SplashScreen from './SplashScreen';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ModalProvider, useModal } from './Context';
import Modal from './Modal';
import _ from 'lodash';
import { useInView } from 'react-intersection-observer';
import { isMobile } from 'react-device-detect';

// Base URL setup for different environments
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

// Video component for individual videos, optimized with memo for performance
const Video = React.memo(({ src, videoID, onVideoClick }) => {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px 0px',
  });

  // Handle play on hover for desktop devices
  const handleMouseEnter = useCallback(() => {
    if (!isMobile && videoRef.current) {
      videoRef.current.play().catch(error => console.error("Play was interrupted.", error));
    }
  }, []);

  // Handle pause on mouse leave for desktop devices
  const handleMouseLeave = useCallback(() => {
    if (!isMobile && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  // Autoplay functionality for mobile devices when the video is in view
  useEffect(() => {
    if (isMobile && inView && videoRef.current) {
      videoRef.current.play().catch(error => console.log("Autoplay was prevented.", error));
    }
  }, [inView]);

  return (
    <div ref={ref} style={{ width: '100%', height: 'auto' }}>
      {inView && (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          onClick={() => {
            console.log(`Video clicked: ${videoID}`);
            onVideoClick(videoID);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ width: '100%', height: 'auto' }}
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => prevProps.videoID === nextProps.videoID && prevProps.src === nextProps.src);

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// MainContent component with video shuffling integrated
function MainContent({ scenes, uniqueVideoIDs }) {
  const navigate = useNavigate();
  const { videoID } = useParams();
  const location = useLocation();
  const { openModal, currentVideoID } = useModal();
  const [shuffledScenes, setShuffledScenes] = useState([]);

  useEffect(() => {
    setShuffledScenes(shuffleArray([...scenes]));
  }, [scenes]);

  useEffect(() => {
    if (videoID && scenes.some(scene => scene.videoID === videoID) && currentVideoID !== videoID) {
      console.log(`Effect to open modal for videoID: ${videoID}`);
      openModal(videoID);
    }
  }, [videoID, scenes, openModal, currentVideoID]);

  const handleVideoNameClick = useCallback((id) => {
    const onWelcomePage = location.pathname === '/welcome';
  
    // Function to actually navigate and open the modal
    const navigateAndOpenModal = () => {
      navigate(`/${id}`); // This navigates to the root or directly to a modal if not on the welcome page
      openModal(id);
    };
  
    if (onWelcomePage) {
      // If we're on the welcome page, smoothly scroll to the main content first
      window.scrollTo({
        top: document.documentElement.clientHeight, // Assuming the main content starts right after the viewport height
        behavior: 'smooth' // Smooth scroll
      });
  
      // Wait for scroll to finish before changing the URL and opening the modal
      setTimeout(() => {
        navigate('/'); // Change the URL to root
        navigateAndOpenModal(); // Now open the modal
      }, 600); // Adjust time based on scroll duration, 600ms is just an example
    } else {
      navigateAndOpenModal();
    }
  }, [openModal, navigate, location.pathname]);

  return (
    <div id="videos-section" className="App">
      <div className="video-menu">
        {uniqueVideoIDs.map((video, index) => (
          <div key={`${video.videoID}-${index}`} onClick={() => handleVideoNameClick(video.videoID)} className="video-menu-item">
            {video.videoName}
          </div>
        ))}
      </div>
      <div className="video-grid">
        {shuffledScenes.map(scene => (
          <Video
            key={scene.sceneURL}
            src={scene.sceneURL}
            videoID={scene.videoID}
            onVideoClick={handleVideoNameClick}
          />
        ))}
      </div>
    </div>
  );
}

// Wrap MainContent with React.memo for performance optimization
const MemoizedMainContent = React.memo(MainContent);

function Home({ scenes, uniqueVideoIDs }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Use a ref to track the initial load of the component
  const initialLoad = useRef(true);
  
  // Determines if the splash screen is visible based on the URL
  const [showSplash, setShowSplash] = useState(location.pathname === '/welcome');
  
  // useCallback is used to memoize handleScroll, so it doesn't change on every render
  const handleScroll = useCallback(() => {
    const scrollThreshold = window.innerHeight * 1.0;
    const hasScrolledPastSplash = window.scrollY > scrollThreshold;
  
    // Only proceed if we're initially on /welcome and have scrolled past the threshold
    if (location.pathname === '/welcome' && hasScrolledPastSplash && showSplash) {
      navigate('/', { replace: true });
      setShowSplash(false); // Update state after URL change
    }
  }, [navigate, location.pathname, showSplash]);  

  useEffect(() => {
    // Add scroll event listener on mount
    const debouncedHandleScroll = _.debounce(handleScroll, 100);
    window.addEventListener('scroll', debouncedHandleScroll);

    // Cleanup on unmount
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [handleScroll]); // handleScroll is a dependency

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false; // Mark initial load as done
      if (location.pathname !== '/welcome') {
        // If not initially loading on /welcome, ensure splash is not shown
        setShowSplash(false);
      }
    } else {
      // Handle navigation that does not involve initial load
      if (location.pathname === '/welcome') {
        setShowSplash(true); // Show splash screen when navigating back to /welcome
      } else {
        setShowSplash(false); // Hide splash screen for other URLs
      }
    }
  }, [location.pathname]);  

  // Prevent scrolling up to the splash screen once hidden
  useEffect(() => {
    if (!showSplash) {
      // Scroll to a point just below the splash screen to prevent scrolling up
      window.scrollTo(0, window.innerHeight);
    }
  }, [showSplash]);

  const splashScreenStyle = showSplash ? {} : { display: 'none' }; // Hide splash screen completely when not visible

  return (
    <>
      <div style={splashScreenStyle}>
        <SplashScreen />
      </div>
      <MemoizedMainContent scenes={scenes} uniqueVideoIDs={uniqueVideoIDs} />
    </>
  );
}

function AppWrapper() {
  // State for scenes and unique video IDs
  const [scenes, setScenes] = useState([]);
  const [uniqueVideoIDs, setUniqueVideoIDs] = useState([]);

  useEffect(() => {
    // Fetch content from the API
    const fetchContent = async () => {
      try {
        const scenesResponse = await axios.get(`${BASE_URL}/api/scenes`);
        setScenes(scenesResponse.data);
        const videosResponse = await axios.get(`${BASE_URL}/api/videos`);
        setUniqueVideoIDs(_.uniqBy(videosResponse.data, 'videoID'));
        console.log('Fetched scenes:', scenesResponse.data);
        console.log('Fetched videos:', videosResponse.data);
      } catch (error) {
        console.error('Error fetching content: ', error);
      }
    };
    fetchContent();
  }, []);

  // Use useMemo to memoize scenes and uniqueVideoIDs so they don't cause unnecessary re-renders
  const memoizedScenes = useMemo(() => scenes, [scenes]);
  const memoizedUniqueVideoIDs = useMemo(() => uniqueVideoIDs, [uniqueVideoIDs]);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <ModalProvider>
          <Routes>
            <Route path="/welcome" element={<Home scenes={memoizedScenes} uniqueVideoIDs={memoizedUniqueVideoIDs} />} />
            <Route path="/" element={<Home scenes={memoizedScenes} uniqueVideoIDs={memoizedUniqueVideoIDs} />} />
            <Route path="/:videoID" element={
              <>
                <Home scenes={memoizedScenes} uniqueVideoIDs={memoizedUniqueVideoIDs} />
                <Modal />
              </>
            } />
          </Routes>
        </ModalProvider>
      </Suspense>
    </Router>
  );
}

export default AppWrapper;
