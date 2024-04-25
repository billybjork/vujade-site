import React, { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { CubeMasterInit } from './cube-master/js/cube/main.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useModal, ModalProvider } from './ModalContext';
import Modal from './Modal';
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
  const [videoNames, setVideoNames] = useState([]);
  const { openModal } = useModal();  // Import the context hook
  const navigate = useNavigate();   // React Router's navigate function

  useEffect(() => {
    const fetchVideoNames = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/videos`);
        const names = response.data.map(video => ({
          id: video.videoID,
          name: video.videoName
        }));
        setVideoNames([...names, ...names]); // Duplicate the array
      } catch (error) {
        console.error('Error fetching video names:', error);
      }
    };
    fetchVideoNames();
  }, []);

  const handleMenuClick = (videoID) => {
    openModal(videoID); // Open modal and set current video ID
    navigate(`/${videoID}`); // Change URL to include videoID
  };

  return (
    <div className="video-menu-wrapper">
      <div className="video-menu">
        {videoNames.map((video, index) => (
          <button key={`${video.id}-${index}`} onClick={() => handleMenuClick(video.id)}>
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
        <ModalProvider>
          <VideoMenu />
          <Routes>
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