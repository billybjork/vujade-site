import React, {
  createContext, useContext, useState, useMemo, useCallback, useEffect
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children, onModalOpen, onModalClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // State to track if it's the initial site load
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // After the initial render, set initialLoad to false
    setInitialLoad(false);
  }, []); // Empty dependency array ensures this runs only once after initial render

  // Function to open the modal with the video ID
  const openModal = useCallback((videoID, location) => {
    // Check if it's the initial load, the URL is the root, OR the videoID is 'about'
    const canOpen = initialLoad || location.pathname === '/' || videoID === 'about';

    if (canOpen && (videoID === 'about' || videoID !== currentVideoID)) {
      setIsModalOpen(true);
      setCurrentVideoID(videoID);

      if (videoID === 'about') {
        navigate('/about', { replace: true });
      } else if (videoID) { 
        navigate(`/${videoID}`, { replace: true });
      }
    }
  }, [initialLoad, currentVideoID, navigate]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentVideoID(null);
    navigate('/', { replace: true }); 
  }, [navigate]);

  const providerValue = useMemo(() => ({
    isModalOpen, currentVideoID, openModal, closeModal, overlayVisible
  }), [
    isModalOpen, currentVideoID, openModal, closeModal, overlayVisible
  ]);

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
    </ModalContext.Provider>
  );
};
