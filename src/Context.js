import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);

  // OpenModal function updated to simply set the modal state and current video ID.
  // This handles opening the modal both programmatically and via URL navigation.
  const openModal = useCallback((videoID) => {
    console.log(`Opening modal for videoID: ${videoID}`);
    setIsModalOpen(true);
    setCurrentVideoID(videoID);
  }, []);

  // CloseModal function simplified to remove the previously included navigateCallback parameter.
  // The function now purely focuses on closing the modal and resetting relevant state.
  // This change is based on the finding that navigateCallback was unnecessary and could potentially cause routing issues.
  const closeModal = useCallback(() => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setCurrentVideoID(null);
  }, []);

  // The context value is memoized to ensure that consumers of the context do not re-render unnecessarily.
  // This is particularly important for performance, as it prevents unnecessary re-renders of components that use this context.
  const providerValue = useMemo(() => ({
    isModalOpen,
    currentVideoID,
    openModal,
    closeModal
  }), [isModalOpen, currentVideoID, openModal, closeModal]);

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
    </ModalContext.Provider>
  );
};