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

  // Function to open the modal with the video ID
  const openModal = useCallback((videoID) => {
    if (!isModalOpen) { // Only allow opening a new modal if none is already open
      console.log("Opening modal with videoID:", videoID);
      setIsModalOpen(true);
      setOverlayVisible(true);
      setCurrentVideoID(videoID);
      if (onModalOpen) onModalOpen();
      // Conditionally update the URL if not already updated
      if (videoID === 'about' && window.location.pathname !== '/about') {
        navigate('/about', { replace: true });
      } else if (window.location.pathname !== `/${videoID}`) {
        navigate(`/${videoID}`, { replace: true });
      }
    }
  }, [navigate, onModalOpen]);

  // Function to close the modal
  const closeModal = useCallback(() => {
    console.log("Closing modal");
    setIsModalOpen(false);
    setOverlayVisible(false); // Hide overlay when closing modal
    setCurrentVideoID(null);
    if (onModalClose) onModalClose(); // Custom callback on close
    if (window.location.pathname !== '/') {
      navigate('/', { replace: true }); // Navigate back to home on close
    }
  }, [navigate, onModalClose]);

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
