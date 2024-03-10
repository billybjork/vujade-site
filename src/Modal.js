import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useModal } from './ModalContext';

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://vujade-site-bd6c94750c62.herokuapp.com'
  : 'http://127.0.0.1:5000';

  function Modal() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isModalOpen, currentVideoID, closeModal } = useModal();
    const [videoInfo, setVideoInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const modalRef = useRef(null);

  // Function to transform video URLs for embedding
  const getEmbeddedVideoUrl = useCallback((url) => {
    const parts = url.split("vimeo.com/")[1];
    const vimeoId = parts.split('/')[0];
    return `https://player.vimeo.com/video/${vimeoId}`;
  }, []);

   // Fetch and set video info based on URL change or currentVideoID update
   useEffect(() => {
    const videoIDFromURL = location.pathname.split('/')[1];
    if (videoIDFromURL && (videoIDFromURL !== currentVideoID || !videoInfo)) {
      setIsLoading(true); // Indicate loading
      axios.get(`${BASE_URL}/api/video_info/${videoIDFromURL}`)
        .then(response => {
          setVideoInfo(response.data);
          setIsLoading(false); // Reset loading state
        })
        .catch(error => {
          console.error('Error fetching video info: ', error);
          setIsLoading(false); // Ensure loading state is reset even on error
        });
    }
  }, [location.pathname, currentVideoID, videoInfo]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    navigate('/'); // Use navigate to change URL back to root
  }, [closeModal, navigate]);

  // Handle closing modal by clicking outside
  useEffect(() => {
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
  }, [isModalOpen, closeModal, handleCloseModal]);

  // Memoize embedded video URL
  const embeddedVideoUrl = useMemo(() => videoInfo ? getEmbeddedVideoUrl(videoInfo.URL) : null, [videoInfo, getEmbeddedVideoUrl]);

  if (isLoading || !videoInfo) { // Show loading indicator or prevent rendering if videoInfo is not available yet
    return <div>Loading...</div>;
  }
  
  return (
    <div className={`modal ${isModalOpen ? 'open' : ''}`} ref={modalRef}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={handleCloseModal}>&times;</span>
        <>
          <h2>{videoInfo ? videoInfo.videoName : 'Loading...'}</h2>
          <div className="embed-container">
            {videoInfo && (
              <iframe
                src={embeddedVideoUrl}
                allow="autoplay; fullscreen"
                allowFullScreen
                title={videoInfo ? videoInfo.videoName : ''}
              ></iframe>
            )}
          </div>
          {videoInfo && <div dangerouslySetInnerHTML={{ __html: videoInfo.Description }}></div>}
        </>
      </div>
    </div>
  );
}

export default Modal;
