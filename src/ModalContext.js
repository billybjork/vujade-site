import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children, onModalOpen, onModalClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);
  const navigate = useNavigate();

  const openModal = useCallback((videoID) => {
    if (!isModalOpen && (window.location.pathname === '/' || videoID === 'about')) { 
      setIsModalOpen(true);
      setCurrentVideoID(videoID);
      if (onModalOpen) onModalOpen();
      if (videoID === 'about') {
        navigate('/about', { replace: true });
      } else {
        navigate(`/${videoID}`, { replace: true });
      }
    }
  }, [isModalOpen, navigate, onModalOpen]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentVideoID(null);
    if (onModalClose) onModalClose();
    if (window.location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [navigate, onModalClose]);

  const providerValue = useMemo(() => ({
    isModalOpen, currentVideoID, openModal, closeModal
  }), [isModalOpen, currentVideoID, openModal, closeModal]);

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
    </ModalContext.Provider>
  );
};
