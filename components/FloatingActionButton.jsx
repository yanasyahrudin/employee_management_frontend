import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const FloatingActionButton = ({ onScrollToTop }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check scroll position
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    });
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          className="btn btn-primary rounded-circle position-fixed"
          style={{
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3, type: "spring" }}
        >
          <FaArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingActionButton;