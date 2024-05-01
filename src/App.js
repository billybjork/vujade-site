import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { CubeMasterInit } from './cube-master/js/cube/main.js';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useModal, ModalProvider } from './ModalContext';
import Modal from './Modal';
import { motion, AnimatePresence } from 'framer-motion';
import _ from 'lodash';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

function CubeWithVideos() {
  const [cubeVideos, setCubeVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const cubeMasterInitialized = useRef(false);

  useEffect(() => {
    const fetchCubeVideos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/scenes`);
        const shuffledScenes = _.shuffle(response.data.map(scene => scene.sceneURL));
        setCubeVideos(shuffledScenes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cube videos:', error);
        setIsLoading(false);
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

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return <div id="cube-container"></div>;
}
function VideoMenu() {
  const [videoNames, setVideoNames] = useState([]);
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

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
    openModal(videoID);
    navigate(`/${videoID}`);
    // setIsMenuOpen(false); // Close the menu when a modal is opened
  };

 // const handleCloseModal = () => {
    // setIsMenuOpen(true); // Open the menu when the modal is closed
  //};

  return (
    <div className="video-menu-wrapper">
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="video-menu-container"
            initial={{ y: 100, opacity: 0 }} // Initial position and opacity
            animate={{ y: 0, opacity: 1 }} // Animation when menu is open
            exit={{ y: 100, opacity: 0 }} // Animation when menu is closed
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} // Easing transition
          >
            {videoNames.map((video, index) => (
              <motion.div
                key={`${video.id}-${index}`}
                className="video-menu-item"
                onClick={() => handleMenuClick(video.id)}
                whileHover={{ scale: 1.1 }} // Scale animation on hover
              >
                {video.name}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AppWrapper() {
  const [scenes, setScenes] = useState([]);
  const [uniqueVideoIDs, setUniqueVideoIDs] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const scenesResponse = await axios.get(`${BASE_URL}/api/scenes`);
        const videosResponse = await axios.get(`${BASE_URL}/api/videos`);
        setScenes(scenesResponse.data);
        setUniqueVideoIDs(_.uniqBy(videosResponse.data, 'videoID'));
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <Router>
      <ModalProvider>
        <VideoMenu />
        <Routes>
          <Route path="/" element={<Home scenes={scenes} uniqueVideoIDs={uniqueVideoIDs} />} />
          <Route path="/:videoID" element={
            <>
              <Home scenes={scenes} uniqueVideoIDs={uniqueVideoIDs} />
              <Modal />
            </>
          } />
        </Routes>
      </ModalProvider>
    </Router>
  );
}

function Home() {
  return (
    <>
      <CubeWithVideos />
    </>
  );
}

export default AppWrapper;
