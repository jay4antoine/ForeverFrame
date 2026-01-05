import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import './LoadingScreen.css';

const loadingMessages = [
  'Analyzing your photo...',
  'Understanding the moment...',
  'Crafting the scene...',
  'Adding cinematic touches...',
  'Enhancing details...',
  'Perfecting the atmosphere...',
  'Finalizing your memory...',
];

function LoadingScreen({ milestone }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1400);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 100);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-content">
        {/* Animated rings */}
        <div className="loading-rings">
          <motion.div
            className="ring ring-1"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="ring ring-2"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.div
            className="ring ring-3"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
          
          {/* Center icon */}
          <motion.div
            className="loading-icon"
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: 'linear'
            }}
          >
            <Heart className="heart-main" size={40} strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Floating sparkles */}
        <div className="sparkle-container">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="sparkle"
              style={{
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            >
              <Sparkles size={16} strokeWidth={1.5} />
            </motion.div>
          ))}
        </div>

        {/* Milestone info */}
        {milestone && (
          <motion.div
            className="loading-milestone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="milestone-label">Creating your</span>
            <span className="milestone-name">{milestone.name}</span>
            <span className="milestone-label">moment</span>
          </motion.div>
        )}

        {/* Progress message */}
        <motion.p
          key={messageIndex}
          className="loading-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {loadingMessages[messageIndex]}
        </motion.p>

        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Background decoration */}
      <div className="loading-bg">
        <div className="bg-gradient bg-gradient-1" />
        <div className="bg-gradient bg-gradient-2" />
        <div className="bg-gradient bg-gradient-3" />
      </div>
    </motion.div>
  );
}

export default LoadingScreen;

