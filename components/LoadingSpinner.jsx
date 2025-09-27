import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <motion.div 
      className="d-flex flex-column justify-content-center align-items-center" 
      style={{ minHeight: '50vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="position-relative mb-3"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div 
          className="spinner-border text-primary"
          style={{ width: '3rem', height: '3rem' }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        
        {/* Outer ring */}
        <motion.div
          className="position-absolute top-0 start-0"
          style={{ 
            width: '3rem', 
            height: '3rem', 
            border: '2px solid transparent',
            borderTop: '2px solid rgba(13, 110, 253, 0.3)',
            borderRadius: '50%'
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
      
      <motion.p 
        className="text-muted mb-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {text}
      </motion.p>
      
      {/* Pulse dots */}
      <motion.div 
        className="d-flex mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="bg-primary rounded-circle me-1"
            style={{ width: '8px', height: '8px' }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;