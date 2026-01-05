import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import './Welcome.css';

function Welcome({ onGetStarted }) {
  return (
    <motion.div
      className="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="welcome-content">
        <motion.div
          className="welcome-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="logo-icon">
            <Heart className="heart-icon" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.h1
          className="welcome-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          ForeverFrame
        </motion.h1>

        <motion.p
          className="welcome-tagline"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Preserve Your Love Milestones with AI-Enhanced Memories
        </motion.p>

        <motion.p
          className="welcome-description"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Transform your cherished photos into cinematic, ultra-realistic scenes 
          that capture the magic of your special moments together.
        </motion.p>

        <motion.button
          className="welcome-cta"
          onClick={onGetStarted}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Begin Your Journey</span>
          <ArrowRight size={20} strokeWidth={2} />
        </motion.button>

        <motion.div
          className="welcome-features"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="feature-item">
            <span className="feature-label">Ultra-HD 4K</span>
          </div>
          <div className="feature-divider"></div>
          <div className="feature-item">
            <span className="feature-label">AI Enhanced</span>
          </div>
          <div className="feature-divider"></div>
          <div className="feature-item">
            <span className="feature-label">Cinematic Quality</span>
          </div>
        </motion.div>
      </div>

      <div className="welcome-decoration">
        <div className="deco-ring deco-ring-1"></div>
        <div className="deco-ring deco-ring-2"></div>
        <div className="deco-ring deco-ring-3"></div>
      </div>
    </motion.div>
  );
}

export default Welcome;

