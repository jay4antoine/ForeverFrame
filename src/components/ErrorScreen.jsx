import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import './ErrorScreen.css';

function ErrorScreen({ message, onRetry, onBack }) {
  return (
    <motion.div
      className="error-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="error-content">
        <motion.div
          className="error-icon-wrapper"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="error-icon">
            <AlertCircle size={40} strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.h1
          className="error-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          Something Went Wrong
        </motion.h1>

        <motion.p
          className="error-message"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {message || 'We encountered an issue while enhancing your photo. Please try again.'}
        </motion.p>

        <motion.div
          className="error-actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <button className="error-btn primary" onClick={onRetry}>
            <RefreshCw size={20} strokeWidth={1.5} />
            <span>Try Again</span>
          </button>
          
          <button className="error-btn secondary" onClick={onBack}>
            <ArrowLeft size={20} strokeWidth={1.5} />
            <span>Go Back</span>
          </button>
        </motion.div>

        <motion.p
          className="error-help"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          If the problem persists, please check your internet connection or try a different photo.
        </motion.p>
      </div>
    </motion.div>
  );
}

export default ErrorScreen;

