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

  const [isScrolling, setIsScrolling] = useState(false); 

  // Function to open the modal with the video ID
  const openModal = useCallback((videoID) => {
    if (!isModalOpen) {
      setIsModalOpen(true);
      setOverlayVisible(true); // Show overlay when opening modal
      setCurrentVideoID(videoID);
      if (onModalOpen) onModalOpen(); // Custom callback on open
      
      // Update URL for deep linking
      if (videoID === 'about') {
        if (window.location.pathname !== '/about') navigate('/about', { replace: true });
      } else {
        if (window.location.pathname !== `/${videoID}`) navigate(`/${videoID}`, { replace: true });
      }
    }
  }, [isModalOpen, navigate, onModalOpen]);

  // Function to close the modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setOverlayVisible(false); // Hide overlay when closing modal
    setCurrentVideoID(null);
    if (onModalClose) onModalClose(); // Custom callback on close
    if (window.location.pathname !== '/') {
      navigate('/', { replace: true }); // Navigate back to home on close
    }
  }, [navigate, onModalClose]);

  // Manage scrolling state
  useEffect(() => {
    const handleScrollStart = () => setIsScrolling(true);
    const handleScrollEnd = () => setIsScrolling(false); 

    if (isModalOpen) {
      document.addEventListener('scroll', handleScrollStart);
      document.addEventListener('touchmove', handleScrollStart);
      document.addEventListener('scrollend', handleScrollEnd);
      document.addEventListener('touchend', handleScrollEnd);
    }

    return () => {
      document.removeEventListener('scroll', handleScrollStart);
      document.removeEventListener('touchmove', handleScrollStart);
      document.removeEventListener('scrollend', handleScrollEnd);
      document.removeEventListener('touchend', handleScrollEnd);
    };
  }, [isModalOpen]);

  // Disable body scrolling when the modal is open
  useEffect(() => {
    if (isModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;  
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isModalOpen]);  

  // Prevent touchmove on overlay to stop scrolling underneath
  useEffect(() => {
    const overlay = document.querySelector('.overlay');
    if (overlay && isModalOpen) {
      overlay.addEventListener('touchmove', (event) => event.preventDefault(), { passive: false });
      return () => {
        overlay.removeEventListener('touchmove', (event) => event.preventDefault(), { passive: false });
      };
    }
  }, [isModalOpen]);

  const providerValue = useMemo(() => ({
    isModalOpen, currentVideoID, openModal, closeModal, overlayVisible, isScrolling
  }), [
    isModalOpen, currentVideoID, openModal, closeModal, overlayVisible, isScrolling
  ]);

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
