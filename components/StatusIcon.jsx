import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

const StatusIcon = ({ status, size = '1rem', className = '', animated = true }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <FaCheckCircle />,
          color: 'text-success',
          bgColor: 'bg-success'
        };
      case 'error':
      case 'danger':
        return {
          icon: <FaTimesCircle />,
          color: 'text-danger',
          bgColor: 'bg-danger'
        };
      case 'warning':
        return {
          icon: <FaExclamationTriangle />,
          color: 'text-warning',
          bgColor: 'bg-warning'
        };
      case 'info':
        return {
          icon: <FaInfoCircle />,
          color: 'text-info',
          bgColor: 'bg-info'
        };
      case 'pending':
      case 'loading':
        return {
          icon: <FaClock />,
          color: 'text-secondary',
          bgColor: 'bg-secondary'
        };
      default:
        return {
          icon: <FaInfoCircle />,
          color: 'text-muted',
          bgColor: 'bg-muted'
        };
    }
  };

  const config = getStatusConfig();

  const IconComponent = () => (
    <span 
      className={`${config.color} ${className}`}
      style={{ fontSize: size }}
    >
      {config.icon}
    </span>
  );

  if (!animated) {
    return <IconComponent />;
  }

  return (
    <motion.span
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.5, 
        type: "spring",
        stiffness: 200
      }}
    >
      <IconComponent />
    </motion.span>
  );
};

export default StatusIcon;