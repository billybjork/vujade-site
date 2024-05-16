import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { CubeMasterInit } from './cube-master/js/cube/main.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useModal, ModalProvider } from './ModalContext';
import _ from 'lodash';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

function CubeWithVideos() {
  const [cubeVideos, setCubeVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);  // Track loading progress
  const cubeContainerRef = useRef(null);
  const cubeMasterInitialized = useRef(false);
  const { openModal, openEnterSiteModal } = useModal();  // Retrieve openModal from context

  // Ref to store the rendering functions
  const renderingControl = useRef({ startRendering: null, stopRendering: null });

  useEffect(() => {
    // Fetch video URLs to be used as textures on the cube
    const fetchCubeVideos = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/scenes`);
        const shuffledScenes = _.shuffle(response.data);
        const first54Videos = shuffledScenes.slice(0, 54).map(scene => scene.sceneURL); // Extract URLs from scenes
        setCubeVideos(first54Videos);
      } catch (error) {
        console.error('Error fetching cube videos:', error);
      }
    };
    fetchCubeVideos();
  }, []);

  useEffect(() => {
    if (cubeVideos.length === 54 && !cubeMasterInitialized.current && cubeContainerRef.current) {
        const controls = CubeMasterInit(
            cubeVideos, 
            () => { setIsLoading(false); }, 
            (progress) => { setLoadProgress(progress); }, 
            cubeContainerRef.current, 
            openModal  // Pass openModal directly
        );
        renderingControl.current = controls;
        cubeMasterInitialized.current = true;
    }
}, [cubeVideos, openModal]);  // Include openModal in the dependency array

  useEffect(() => {
    if (!isLoading) {
      openEnterSiteModal();
    }
  }, [isLoading, openEnterSiteModal]);

  return (
    <div id="cube-container" ref={cubeContainerRef} className={isLoading ? 'hidden' : 'visible'}>
        {isLoading && <div className="loading">{`${loadProgress}% Loaded`}</div>}
    </div>
  );
}

function EnterSiteModal() {
  const { enterSiteModalOpen, closeEnterSiteModal } = useModal();

  if (!enterSiteModalOpen) return null;

  return (
    <div className="enter-site-modal-backdrop">
      <div className="enter-site-modal">
        <button className="enter-site-button" onClick={closeEnterSiteModal}>Enter Site</button>
      </div>
    </div>
  );
}

function Modal() {
  const { isModalOpen, currentVideoID, closeModal } = useModal();
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false); // State to handle loading of video information

  console.log(`Modal status: ${isModalOpen}, Video ID: ${currentVideoID}`); // Add this to check state

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

  // Return modal with conditional rendering based on open/close state
  return (
    <div className={`modal-backdrop ${isModalOpen ? 'open' : 'closed'}`}>
      <div className="modal" onClick={e => e.stopPropagation()}>
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
      </div>
    </div>
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
            <CubeWithVideos scenes={scenes} />
          </>} />
        </Routes>
        <Modal />
        <EnterSiteModal />
      </ModalProvider>
    </Router>
  );
}

export default AppWrapper;
