import React, { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { CubeMasterInit } from './cube-master/js/cube/main.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import _ from 'lodash';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

function CubeWithVideos() {
  const [cubeVideos, setCubeVideos] = useState([]);
  const cubeMasterInitialized = useRef(false);

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
    if (cubeVideos.length > 0 && !cubeMasterInitialized.current) {
      console.log('Initializing CubeMaster with new video textures');
      CubeMasterInit(cubeVideos);
      cubeMasterInitialized.current = true;
    }
  }, [cubeVideos]);

  return <div id="cube-container"></div>;
}

function VideoMenu() {
  const navigate = useNavigate();
  const menuRef = useRef(null); // Reference to the menu container
  const [videoNames, setVideoNames] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    const fetchVideoNames = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/videos`);
        setVideoNames(response.data.map(video => ({
          id: video.videoID,
          name: video.videoName
        })));
      } catch (error) {
        console.error('Error fetching video names:', error);
      }
    };
    fetchVideoNames();
  }, []);

  const handleMenuClick = (videoId, index) => {
    setIsFrozen(true);
    const itemWidth = menuRef.current.children[0].offsetWidth;
    const centerPosition = window.innerWidth / 2 - itemWidth / 2;
    const itemOffset = itemWidth * index;
    menuRef.current.style.transition = 'transform 0.5s ease'; // Smooth transition for repositioning
    menuRef.current.style.transform = `translateX(${centerPosition - itemOffset}px)`;
    setSelectedId(videoId);
    navigate(`/${videoId}`);
  };

  const resetMenu = () => {
    setSelectedId(null);
    setIsFrozen(false);
    menuRef.current.style.transition = 'none'; // Remove transition to resume smooth infinite scrolling
    menuRef.current.style.transform = 'translateX(0)';
  };

  return (
    <div className="video-menu-wrapper">
      {selectedId !== null && (
        <div className="backdrop" onClick={resetMenu}>
          <button className="reset-button">X</button>
        </div>
      )}
      <div ref={menuRef} className="video-menu" style={{ animationPlayState: isFrozen ? 'paused' : 'running' }}>
        {videoNames.map((video, index) => (
          <button key={`${video.id}-${index}`} onClick={() => handleMenuClick(video.id, index)}>
            {video.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function Home() {
  return (
    <>
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
        <VideoMenu />
        <Routes>
          <Route path="/" element={<Home scenes={memoizedScenes} uniqueVideoIDs={memoizedUniqueVideoIDs} />} />
          <Route path="/:videoID" element={<Home scenes={memoizedScenes} uniqueVideoIDs={memoizedUniqueVideoIDs} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppWrapper;
