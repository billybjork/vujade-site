import React, { useState, useEffect, Suspense, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import SplashScreen from './SplashScreen';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ModalProvider, useModal } from './ModalContext';
import Modal from './Modal';
import _ from 'lodash';
import { useInView } from 'react-intersection-observer';
import { isMobile } from 'react-device-detect';

// to replace later as needed
import * as CubeMaster from './cube-master/js/cube/main.js';

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
  
    // Function to navigate and open the modal
    const navigateAndOpenModal = () => {
      if (!onWelcomePage || location.pathname !== `/${id}`) {
        navigate(`/${id}`); // Navigate only if not already on the target path
      }
      openModal(id);
    };
  
    if (onWelcomePage) {
      window.scrollTo({
        top: document.documentElement.clientHeight,
        behavior: 'smooth'
      });
  
      setTimeout(() => {
        navigate('/');
        console.log(`Preparing to open modal for videoID: ${id}`);
        navigateAndOpenModal();
      }, 600);
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
  const initialLoad = useRef(true);
  const [showSplash, setShowSplash] = useState(location.pathname === '/welcome');

  // This ref is used to store the scroll position before the URL change
  const scrollPositionBeforeNavigation = useRef(0);

  const handleScroll = useCallback(() => {
    const scrollThreshold = window.innerHeight * 1.0;
    const hasScrolledPastSplash = window.scrollY > scrollThreshold;

    if (location.pathname === '/welcome' && hasScrolledPastSplash && showSplash) {
      // Store the current scroll position before changing the URL
      scrollPositionBeforeNavigation.current = window.scrollY;

      navigate('/', { replace: true });
      setShowSplash(false); // Update state to hide splash screen
    }
  }, [navigate, location.pathname, showSplash]);

  useEffect(() => {
    // Add scroll event listener on mount
    window.addEventListener('scroll', handleScroll);

    // Cleanup on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!showSplash) {
      // Restore the scroll position after the splash screen is hidden
      console.log(`Scroll position before navigation: ${scrollPositionBeforeNavigation.current}`);
      window.scrollTo(0, scrollPositionBeforeNavigation.current);
      console.log('Scroll position after splash screen hidden, restored to previous state');
    }
  }, [showSplash]);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false; // Mark initial load as done
    } else {
      // Adjust logic based on navigation that does not involve the initial load
      setShowSplash(location.pathname === '/welcome');
    }
  }, [location.pathname]);

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
            <Route path="/cube-master" element={<CubeMaster />} />
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
