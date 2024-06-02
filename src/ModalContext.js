import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for handling URL changes

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);
  const [enterSiteModalOpen, setEnterSiteModalOpen] = useState(false);
  const navigate = useNavigate();  // Hook to navigate programmatically

  // Opens the video modal and sets the current video ID
  const openModal = useCallback((videoID) => {
    console.log(`Opening modal for video ID: ${videoID}`);
    setIsModalOpen(false); // Close the modal first
    setCurrentVideoID(null); // Reset the video ID
    setTimeout(() => { // Add a small delay
      setIsModalOpen(true);
      setCurrentVideoID(videoID);
      if (window.location.pathname !== `/${videoID}`) {
        navigate(`/${videoID}`, { replace: true });  // Navigate only if not already on this path
      }
    }, 100); // 100ms delay
  }, [navigate]);  

  // Closes the video modal and resets the video ID
  const closeModal = useCallback(() => {
    console.log('Attempting to close modal...');
    setIsModalOpen(false);
    setCurrentVideoID(null);
    if (window.location.pathname !== '/') {
      console.log('Navigating back to root...');
      navigate('/', { replace: true });
    }
  }, [navigate]);  

  // Opens the "Enter site" modal
  const openEnterSiteModal = useCallback(() => {
    setEnterSiteModalOpen(true);
    console.log("enterSiteModalOpen after open:", enterSiteModalOpen); // This will still show the old state due to closure
  }, []);

  // Closes the "Enter site" modal
  const closeEnterSiteModal = useCallback(() => {
    setEnterSiteModalOpen(false);
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({
    isModalOpen, currentVideoID, openModal, closeModal,
    enterSiteModalOpen, openEnterSiteModal, closeEnterSiteModal
  }), [
    isModalOpen, currentVideoID, openModal, closeModal,
    enterSiteModalOpen, openEnterSiteModal, closeEnterSiteModal
  ]);

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
    </ModalContext.Provider>
  );
};
