import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useModal } from './Context';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

function Modal() {
  const location = useLocation();
  const { isModalOpen, currentVideoID, closeModal } = useModal();
  const [videoInfo, setVideoInfo] = useState(null);
  const modalRef = useRef(null);

  console.log('Rendering Modal component', { isModalOpen, currentVideoID });

  const handleCloseModal = useCallback(() => {
    closeModal();
    // Manipulate URL to go back to the root without causing a re-render
    window.history.pushState({}, '', '/');
  }, [closeModal]);  

  useEffect(() => {
    let isMounted = true;
    // Check if videoInfo is already set for the currentVideoID to prevent unnecessary fetching
    if (currentVideoID && isModalOpen && (!videoInfo || videoInfo.videoID !== currentVideoID)) {
      axios.get(`${BASE_URL}/api/video_info/${currentVideoID}`)
        .then(response => {
          if (isMounted) {
            setVideoInfo(response.data);
          }
        })
        .catch(error => {
          console.error('Error fetching video info: ', error);
        });
    } else if (!isModalOpen) {
      setVideoInfo(null); // Reset videoInfo when modal is closed
    }

    return () => {
      isMounted = false;
    };
}, [currentVideoID, isModalOpen, videoInfo]);

  useEffect(() => {
    // Setup to close the modal by clicking outside
    const handleOuterClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleOuterClick);
      document.body.classList.add('body-lock');
    } else {
      document.removeEventListener('mousedown', handleOuterClick);
      document.body.classList.remove('body-lock');
    }

    return () => {
      document.removeEventListener('mousedown', handleOuterClick);
      document.body.classList.remove('body-lock');
    };
  }, [isModalOpen, handleCloseModal]);

  useEffect(() => {
    // Ensure modal closes if navigating away
    if (location.pathname === '/' && isModalOpen) {
      closeModal();
    }
  }, [location, isModalOpen, closeModal]);

  // Helper function to transform video URLs for embedding
  const getEmbeddedVideoUrl = (url) => {
    const parts = url.split("vimeo.com/")[1];
    const vimeoId = parts.split('/')[0];
    return `https://player.vimeo.com/video/${vimeoId}`;
  };

  // Memoize embedded video URL
  const embeddedVideoUrl = useMemo(() => videoInfo ? getEmbeddedVideoUrl(videoInfo.URL) : null, [videoInfo]);

  // Return null early if the modal should not be open or if there is no video info
  if (!isModalOpen || !videoInfo) return null;

  return (
    <div className={`modal ${isModalOpen ? 'open' : ''}`} ref={modalRef}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={handleCloseModal}>&times;</span>
        <h2>{videoInfo.videoName}</h2>
        <div className="embed-container">
          <iframe
            src={embeddedVideoUrl} // Use memoized URL
            allow="autoplay; fullscreen"
            allowFullScreen
            title={videoInfo.videoName}
          ></iframe>
        </div>
        <div dangerouslySetInnerHTML={{ __html: videoInfo.Description }}></div>
      </div>
    </div>
  );
}

export default Modal;