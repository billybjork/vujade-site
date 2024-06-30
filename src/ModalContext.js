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
  const openModal = useCallback((videoID) => {
    setIsModalOpen(true);
    setCurrentVideoID(videoID);

    // Navigate only if opening from the root or for the 'about' modal
    if (location.pathname === '/' || videoID === 'about') {
      navigate(videoID === 'about' ? '/about' : `/${videoID}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  // Function to close the modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentVideoID(null);
    navigate('/', { replace: true }); // Always navigate back to root on close
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
