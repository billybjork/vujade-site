import React, { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { CubeMasterInit } from './cube-master/js/cube/main.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Routes>
          <Route path="/" element={<Home scenes={memoizedScenes} uniqueVideoIDs={memoizedUniqueVideoIDs} />} />
          <Route path="/:videoID" element={<Home scenes={memoizedScenes} uniqueVideoIDs={memoizedUniqueVideoIDs} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppWrapper;
