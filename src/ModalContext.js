import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);

  const openModal = useCallback((videoID) => {
    setIsModalOpen(true);
    setCurrentVideoID(videoID);
    // Optionally delay hiding the UI if needed to coordinate with modal animations
  }, []);  

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentVideoID(null);
    setTimeout(() => setUiVisible(true), 100); // Delay visibility to trigger fade-in animation
  }, []);

  const providerValue = useMemo(() => ({
    isModalOpen, currentVideoID, openModal, closeModal
  }), [isModalOpen, currentVideoID, openModal, closeModal ]);

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
    </ModalContext.Provider>
  );
};