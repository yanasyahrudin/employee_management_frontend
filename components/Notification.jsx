import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success',
          icon: <FaCheckCircle />,
          color: 'text-white'
        };
      case 'error':
        return {
          bg: 'bg-danger',
          icon: <FaExclamationCircle />,
          color: 'text-white'
        };
      case 'warning':
        return {
          bg: 'bg-warning',
          icon: <FaExclamationTriangle />,
          color: 'text-dark'
        };
      default:
        return {
          bg: 'bg-info',
          icon: <FaInfoCircle />,
          color: 'text-white'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`alert ${styles.bg} ${styles.color} d-flex align-items-center position-fixed`}
          style={{
            top: '80px',
            right: '20px',
            zIndex: 9999,
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          initial={{ opacity: 0, x: 100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, y: -20 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <motion.div 
            className="me-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2, type: "spring" }}
          >
            {styles.icon}
          </motion.div>
          <span className="flex-grow-1">{message}</span>
          <motion.button
            className={`btn-close ${styles.color === 'text-white' ? 'btn-close-white' : ''} ms-2`}
            onClick={() => setShow(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;