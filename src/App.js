import React, { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import axios from 'axios';
import './App.css';
import SplashScreen from './SplashScreen';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ModalProvider } from './ModalContext';
import Modal from './Modal';
import _ from 'lodash';

import { CubeMasterInit } from './cube-master/js/cube/main.js';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

  function CubeWithVideos() {
    const [cubeVideos, setCubeVideos] = useState([]);
  
    // Log component mount and unmount
    useEffect(() => {
      console.log('CubeWithVideos component mounted.');
      
      // Cleanup function to log when the component unmounts
      return () => {
        console.log('CubeWithVideos component unmounted.');
        // If there is a cleanup method for CubeMasterInit, call it here to prevent duplicates
        // For example: CubeMasterCleanup();
      };
    }, []);
  
    useEffect(() => {
      const fetchCubeVideos = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/scenes`);
          const shuffledScenes = _.shuffle(response.data.map(scene => scene.sceneURL));
          setCubeVideos(shuffledScenes);
        } catch (error) {
          console.error('Error fetching cube videos:', error);
        }
      };
      fetchCubeVideos();
    }, []);
  
    useEffect(() => {
      if (cubeVideos.length > 0) {
        console.log('Initializing CubeMaster with new video textures');
        CubeMasterInit(cubeVideos);
      }
    }, [cubeVideos]);
  
    return <div id="cube-container"></div>;
  }  

function Home({ scenes, uniqueVideoIDs }) {
  const navigate = useNavigate();
  const location = useLocation();
  const showSplash = useState(location.pathname === '/welcome')[0];

  // This ref is used to store the scroll position before the URL change
  const scrollPositionBeforeNavigation = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 1.0;
      const hasScrolledPastSplash = window.scrollY > scrollThreshold;

      if (location.pathname === '/welcome' && hasScrolledPastSplash && showSplash) {
        // Store the current scroll position before changing the URL
        scrollPositionBeforeNavigation.current = window.scrollY;

        navigate('/', { replace: true });
      }
    };

    // Add scroll event listener on mount
    window.addEventListener('scroll', handleScroll);

    // Cleanup on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate, location.pathname, showSplash]);

  const splashScreenStyle = showSplash ? {} : { display: 'none' }; // Hide splash screen completely when not visible

  return (
    <>
      <div style={splashScreenStyle}>
        <SplashScreen />
      </div>
      <CubeWithVideos />
    </>
  );
}

function AppWrapper() {
  const [scenes, setScenes] = useState([]);
  const [uniqueVideoIDs, setUniqueVideoIDs] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      const scenesResponse = await axios.get(`${BASE_URL}/api/scenes`);
      setScenes(scenesResponse.data);
      const videosResponse = await axios.get(`${BASE_URL}/api/videos`);
      setUniqueVideoIDs(_.uniqBy(videosResponse.data, 'videoID'));
    };
    fetchContent();
  }, []);

  const memoizedScenes = useMemo(() => scenes, [scenes]);
  const memoizedUniqueVideoIDs = useMemo(() => uniqueVideoIDs, [uniqueVideoIDs]);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Home scenes={memoizedScenes} uniqueVideoIDs={memoizedUniqueVideoIDs} />} />
            <Route path="/welcome" element={<Home scenes={memoizedScenes} uniqueVideoIDs={memoizedUniqueVideoIDs} />} />
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
