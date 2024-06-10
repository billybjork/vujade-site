import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children, onModalOpen, onModalClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);  // State to manage overlay visibility
  const navigate = useNavigate();  // Hook to navigate programmatically

  // Opens the modal and sets the current video ID or 'about'
  const openModal = useCallback((videoID) => {
    setIsModalOpen(true);
    setOverlayVisible(true);  // Ensure the overlay is visible when any modal is opened
    setCurrentVideoID(videoID);
    if (onModalOpen) onModalOpen();  // Trigger custom callback when modal opens

    // Adjust navigation logic to properly handle 'about' page or other video IDs
    if (videoID === 'about') {
      if (window.location.pathname !== '/about')
          navigate('/about', { replace: true });
    } else {
      if (window.location.pathname !== `/${videoID}`)
          navigate(`/${videoID}`, { replace: true });
    }
  }, [navigate, onModalOpen]);

  // Closes the modal and resets the video ID
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setOverlayVisible(false);  // Hide overlay when modal is closed
    setCurrentVideoID(null);
    if (onModalClose) onModalClose();  // Trigger custom callback when modal closes
    if (window.location.pathname !== '/') {
      navigate('/', { replace: true });  // Navigate to the root path after closing the modal
    }
  }, [navigate, onModalClose]);

  // Memoize the context value to avoid unnecessary re-renders
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

export default ModalProvider;
