import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

// Create context for managing modal state and functionality
const ModalContext = createContext();

// Custom hook to easily access the modal context
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children, onModalOpen, onModalClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const navigate = useNavigate();

  // Track if the current URL is the root URL ('/')
  const location = useLocation(); // Get location object
  const [isRootURL, setIsRootURL] = useState(location.pathname === '/');

  useEffect(() => {
      setIsRootURL(location.pathname === '/'); // Update isRootURL whenever location changes
  }, [location]);

  // Function to open the modal with the video ID
  const openModal = useCallback((videoID) => {
      // Only open modal if it's currently closed AND we are on the root URL
      if (!isModalOpen && isRootURL) {
          console.log('Opening modal with videoID:', videoID);
          setIsModalOpen(true);
          setOverlayVisible(true); // Show overlay when opening modal
          setCurrentVideoID(videoID);
          if (onModalOpen) onModalOpen(); // Call the optional callback function passed as a prop

          // Update URL for deep linking (optional)
          if (videoID === 'about') {
              if (window.location.pathname !== '/about') navigate('/about', { replace: true });
          } else {
              if (window.location.pathname !== `/${videoID}`) navigate(`/${videoID}`, { replace: true });
          }
      } else {
          console.log('Modal already open, or not on root URL. Not opening another one.');
      }
  }, [isModalOpen, isRootURL, navigate, onModalOpen]);

  // Function to close the modal
  const closeModal = useCallback(() => {
      console.log('Closing modal');
      setIsModalOpen(false);
      setOverlayVisible(false); // Hide overlay when closing modal
      setCurrentVideoID(null);
      if (onModalClose) onModalClose();
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
      overlay.style.touchAction = 'none'; // Prevent default touch actions
      overlay.addEventListener('click', (event) => event.stopPropagation(), false);
      return () => {
        overlay.removeEventListener('touchmove', (event) => event.preventDefault(), { passive: false });
        overlay.style.touchAction = ''; // Reset touch action when modal is closed
        overlay.removeEventListener('click', (event) => event.stopPropagation(), false);
      };
    }
  }, [isModalOpen]);

  const providerValue = useMemo(() => ({
    isModalOpen, currentVideoID, openModal, closeModal, overlayVisible, isScrolling, isRootURL
  }), [
    isModalOpen, currentVideoID, openModal, closeModal, overlayVisible, isScrolling, isRootURL
  ]);

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
