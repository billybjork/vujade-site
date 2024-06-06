import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);
  const navigate = useNavigate();  // Hook to navigate programmatically

  // Opens the modal and sets the current video ID or 'about'
  const openModal = useCallback((videoID) => {
    console.log(`Opening modal for video ID: ${videoID}`);
    setIsModalOpen(true);
    setCurrentVideoID(videoID);

    // Adjust navigation logic to properly handle 'about' page
    if (videoID === 'about') {
        if (window.location.pathname !== '/about')
            navigate('/about', { replace: true });
    } else {
        if (window.location.pathname !== `/${videoID}`)
            navigate(`/${videoID}`, { replace: true });
    }
}, [navigate]);

  // Closes the modal and resets the video ID
  const closeModal = useCallback(() => {
    setIsModalOpen(false);  // Set the modal open state to false
    setCurrentVideoID(null);  // Reset the current video ID
    if (window.location.pathname !== '/') {
      navigate('/', { replace: true });  // Navigate to the root path
    }
  }, [navigate]);  

  // Memoize the context value to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({
    isModalOpen, currentVideoID, openModal, closeModal,
  }), [
    isModalOpen, currentVideoID, openModal, closeModal,
  ]);

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
