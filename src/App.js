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
          onClick={() => onVideoClick(videoID)}
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
  const { videoID } = useParams();
  const { openModal, currentVideoID } = useModal();
  const [shuffledScenes, setShuffledScenes] = useState([]);

  useEffect(() => {
    setShuffledScenes(shuffleArray([...scenes]));
  }, [scenes]);

  useEffect(() => {
    if (videoID && scenes.some(scene => scene.videoID === videoID) && currentVideoID !== videoID) {
      openModal(videoID);
    }
  }, [videoID, scenes, openModal, currentVideoID]);

  const handleVideoNameClick = useCallback((id) => {
    window.history.pushState({ modalOpen: true }, '', `/${id}`);
    openModal(id);
  }, [openModal]);

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
  const [showSplash, setShowSplash] = useState(location.pathname === '/welcome');

  useEffect(() => {
    // Adjust for new initial splash page at /welcome and main content at root URL (/)
    const handleScroll = _.debounce(() => {
      // Logic to transition from splash page to main content based on scroll
      if (window.scrollY > window.innerHeight * 1.0 && location.pathname !== '/') {
        navigate('/');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate, location.pathname]);

  useEffect(() => {
    // Ensure that navigating directly to "/" shows main content and "/welcome" shows splash
    setShowSplash(location.pathname === '/welcome');
  }, [location.pathname]);

  return (
    <>
      {showSplash ? <SplashScreen /> : null}
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
            <Route path="/:videoID" element={<Modal />} />
          </Routes>
        </ModalProvider>
      </Suspense>
    </Router>
  );
}

export default AppWrapper;