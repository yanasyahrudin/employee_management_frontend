import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="alert alert-danger"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h4 className="alert-heading">
                <FaExclamationTriangle className="me-2" />
                Oops! Something went wrong
              </h4>
              <p className="mb-3">
                There was an error loading the page. Please try refreshing or go back to the homepage.
              </p>
              <hr />
              <div className="d-flex gap-2 justify-content-center">
                <motion.button
                  className="btn btn-primary"
                  onClick={() => window.location.href = '/'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaHome className="me-2" />
                  Go Home
                </motion.button>
                <motion.button
                  className="btn btn-outline-secondary"
                  onClick={() => window.location.reload()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRedo className="me-2" />
                  Refresh Page
                </motion.button>
              </div>
            </motion.div>
            
            {process.env.NODE_ENV === 'development' && (
              <motion.details 
                className="mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <summary className="btn btn-outline-info btn-sm">
                  Show Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-light text-start">
                  <h6>Error:</h6>
                  <pre className="text-danger">{this.state.error && this.state.error.toString()}</pre>
                  <h6>Stack Trace:</h6>
                  <pre className="text-muted small">{this.state.errorInfo.componentStack}</pre>
                </div>
              </motion.details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;