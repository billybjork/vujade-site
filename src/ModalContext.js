import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);
  const [uiVisible, setUiVisible] = useState(true); // Ensuring this is initialized

  const openModal = useCallback((videoID) => {
    setIsModalOpen(true);
    setCurrentVideoID(videoID);
    setUiVisible(false); // Optionally hide UI when modal is open
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentVideoID(null);
    setUiVisible(true); // Show UI when modal is closed
  }, []);

  const providerValue = useMemo(() => ({
    isModalOpen, currentVideoID, openModal, closeModal, uiVisible
  }), [isModalOpen, currentVideoID, uiVisible]);

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
    </ModalContext.Provider>
  );
};
