import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { CubeMasterInit } from './cube-master/js/cube/main.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useModal, ModalProvider } from './ModalContext';
import { motion, AnimatePresence } from 'framer-motion';
import _ from 'lodash';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

function VideoMenu() {
  const [videoNames, setVideoNames] = useState([]);
  const { openModal, uiVisible, setUiVisible } = useModal(); // Assuming `setUiVisible` is available to manage `uiVisible`

  useEffect(() => {
    async function fetchVideoNames() {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/videos`);
        // Repeat the data twice
        const repeatedData = [...data, ...data]; 
        // Map each video with a unique suffix to ensure unique keys
        setVideoNames(repeatedData.map((video, index) => ({
          id: video.videoID + "_" + index, // Appending index to videoID for unique key
          name: video.videoName
        })));
        setUiVisible(false); // Initially set uiVisible to false to hide the menu
        setTimeout(() => setUiVisible(true), 100); // Delay visibility to trigger animation
      } catch (error) {
        console.error('Error fetching video names:', error);
      }
    }
    fetchVideoNames();
  }, []);

  useEffect(() => {
    console.log(`UI Visible: ${uiVisible}`); // Log uiVisible state changes
  }, [uiVisible]);

  return (
    <AnimatePresence>
      {uiVisible && (
        <motion.div
        className="video-menu-container"
        initial={{ opacity: 1, visibility: "visible" }}
        animate={{ opacity: uiVisible ? 1 : 0, visibility: uiVisible ? "visible" : "hidden" }}
        exit={{ opacity: 0, visibility: "hidden" }}
        transition={{ duration: 0.5 }}
      >
        {videoNames.map(video => (
          <motion.div
            key={video.id}
            className="video-menu-item"
            onClick={() => openModal(video.id.split('_')[0])}
            whileHover={{ scale: 1.1 }}
          >
            {video.name}
          </motion.div>
        ))}
      </motion.div>
      )}
    </AnimatePresence>
  );
}  

function Modal() {
  const { isModalOpen, currentVideoID, closeModal } = useModal();
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false); // State to handle loading of video information

  // Effect to fetch video information based on currentVideoID
  useEffect(() => {
    async function fetchVideoInfo() {
      if (currentVideoID) {
        setLoading(true); // Start loading
        try {
          const { data } = await axios.get(`${BASE_URL}/api/video_info/${currentVideoID}`);
          setVideoInfo(data); // Set fetched data to videoInfo state
        } catch (error) {
          console.error('Error fetching video info:', error);
          setVideoInfo(null); // Reset video info on error
        }
        setLoading(false); // Stop loading
      }
    }
    fetchVideoInfo();
  }, [currentVideoID]);

  // Handling the case where videoInfo is null
  if (!isModalOpen || loading) return null;  // Display nothing if the modal is closed or loading

  // Ensure that videoInfo is available before trying to access the URL
  if (!videoInfo) {
    return (
      <div className="modal-backdrop">
        <div className="loading-container"></div>
      </div>
    );
  }

  // Extract video ID from videoInfo URL
  const videoID = videoInfo.URL.split("/")[3];

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="modal"
          initial={{ y: '100vh' }}
          animate={{ y: 0 }}
          exit={{ y: '100vh' }}
          transition={{ duration: 0.5 }}
          onClick={e => e.stopPropagation()}
        >
          <span className="close" onClick={() => {
            closeModal();
            setVideoInfo(null); // Reset video information on modal close
          }}>&times;</span>
          <div className="embed-container">
            <iframe
              key={videoID} // Assign key prop to force recreation on ID change
              src={`https://player.vimeo.com/video/${videoID}`}
              allow="autoplay; fullscreen"
              allowFullScreen
              title={videoInfo.videoName}
            ></iframe>
          </div>
          <div className="text-container">
            <h2>{videoInfo.videoName}</h2>
            <div dangerouslySetInnerHTML={{ __html: videoInfo.Description }}></div>
          </div>
          <div className="gradient-overlay"></div>  {/* Gradient overlay added here */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  ); 
}

function CubeWithVideos() {
  const [cubeVideos, setCubeVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const cubeMasterInitialized = useRef(false);

  // Ref to store the rendering functions
  const renderingControl = useRef({ startRendering: null, stopRendering: null });

  useEffect(() => {
    // Fetch video URLs to be used as textures on the cube
    const fetchCubeVideos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/scenes`);
        // Shuffle the scenes to randomize the textures used on the cube
        const shuffledScenes = _.shuffle(response.data.map(scene => scene.sceneURL));
        setCubeVideos(shuffledScenes);
      } catch (error) {
        console.error('Error fetching cube videos:', error);
      } finally {
        setIsLoading(false); // Ensures loading state is updated whether or not the fetch succeeds
      }
    };
    fetchCubeVideos();
  }, []);

  useEffect(() => {
    if (cubeVideos.length > 0 && !cubeMasterInitialized.current) {
      console.log('Initializing CubeMaster with new video textures');
      const controls = CubeMasterInit(cubeVideos); // Initialize the cube with videos
      renderingControl.current = controls;  // Store the rendering controls
      cubeMasterInitialized.current = true;
    }
  }, [cubeVideos]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <AnimatePresence>
        <motion.div
          id="cube-container"
          initial={{ opacity: 0 }}  // Start from invisible to handle the initial load
          animate={{ opacity: 1 }}  // Animate to fully visible once loaded
          exit={{ opacity: 0 }}    // Handle the exit animation
          transition={{ duration: 0.5 }}  // Smooth transition for opacity changes
        >
        </motion.div>
    </AnimatePresence>
  );
}

function AppWrapper() {
  const [scenes, setScenes] = useState([]);
  const { openModal } = useModal();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/scenes`);
        setScenes(response.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <Router>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<>
            <VideoMenu onVideoSelect={openModal} />
            <CubeWithVideos scenes={scenes} />
          </>} />
        </Routes>
        <Modal />
      </ModalProvider>
    </Router>
  );
}

export default AppWrapper;
