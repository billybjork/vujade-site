import React, {
  createContext, useContext, useState, useMemo, useCallback, useEffect
} from 'react';
import { useNavigate } from 'react-router-dom';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children, onModalOpen, onModalClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigate = useNavigate();
  const [initialLoad, setInitialLoad] = useState(true);

  // Function to open the modal with the video ID
  const openModal = useCallback((videoID, location) => {
    setIsModalOpen(true);
    setCurrentVideoID(videoID);

    // Check if location is available before navigating
    if (location && (location.pathname === '/' || videoID === 'about')) {
        navigate(videoID === 'about' ? '/about' : `/${videoID}`, { replace: true });
    } else if (videoID === 'about') {
        // If location is not available, delay the navigation
        setTimeout(() => navigate('/about', { replace: true }), 100); // Adjust delay if needed
    }
}, [navigate]);

const closeModal = useCallback((location) => {
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
