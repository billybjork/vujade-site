import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  // State for video modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);

  // State for "Enter site" modal control
  const [enterSiteModalOpen, setEnterSiteModalOpen] = useState(false);

  // Opens the video modal and sets the current video ID
  const openModal = useCallback((videoID) => {
    setIsModalOpen(true);
    setCurrentVideoID(videoID);
    // Optionally delay hiding the UI if needed to coordinate with modal animations
  }, []);  

  // Closes the video modal and resets the video ID
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentVideoID(null);
  }, []);

  // Opens the "Enter site" modal
  const openEnterSiteModal = useCallback(() => {
    setEnterSiteModalOpen(true);
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
