import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);

  // Memoize the openModal function
  const openModal = useCallback((videoID) => {
    console.log(`Opening modal for videoID: ${videoID}`);
    setIsModalOpen(true);
    setCurrentVideoID(videoID);
  }, []); // No dependencies, this function does not need to be recreated

  // Memoize the closeModal function
  const closeModal = useCallback(() => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setCurrentVideoID(null);
  }, []); // No dependencies, this function does not need to be recreated

  // Memoize the context value to ensure that it doesn't trigger unnecessary re-renders
  const providerValue = useMemo(() => ({
    isModalOpen, currentVideoID, openModal, closeModal
  }), [isModalOpen, currentVideoID, openModal, closeModal]);

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
    </ModalContext.Provider>
  );
};