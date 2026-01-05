import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Heart, 
  Camera,
  Check
} from 'lucide-react';
import './PreviewScreen.css';

function PreviewScreen({ originalImage, processedImage, milestone, onBack, onNewPhoto }) {
  const [comparePosition, setComparePosition] = useState(50);
  const [showOriginal, setShowOriginal] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSliderChange = (e) => {
    setComparePosition(Number(e.target.value));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `foreverframe-${milestone?.id || 'memory'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share && processedImage) {
      try {
        const response = await fetch(processedImage);
        const blob = await response.blob();
        const file = new File([blob], 'foreverframe-memory.jpg', { type: 'image/jpeg' });
        
        await navigator.share({
          title: 'ForeverFrame Memory',
          text: `My ${milestone?.name || 'special'} moment, enhanced with ForeverFrame`,
          files: [file],
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    }
  };

  return (
    <motion.div
      className="preview-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="preview-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div className="preview-title">
          <Heart size={18} strokeWidth={1.5} />
          <span>{milestone?.name || 'Your Memory'}</span>
        </div>
        <div className="header-spacer" />
      </header>

      <main className="preview-content">
        <motion.div
          className="preview-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="image-compare">
            {/* Processed Image (background) */}
            <div className="compare-layer compare-processed">
              <img src={processedImage} alt="Enhanced" />
            </div>
            
            {/* Original Image (foreground, clipped) */}
            <div 
              className="compare-layer compare-original"
              style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
            >
              <img src={originalImage} alt="Original" />
            </div>
            
            {/* Slider line */}
            <div 
              className="compare-slider"
              style={{ left: `${comparePosition}%` }}
            >
              <div className="slider-line" />
              <div className="slider-handle">
                <div className="handle-arrows">
                  <span className="arrow-left" />
                  <span className="arrow-right" />
                </div>
              </div>
            </div>
            
            {/* Labels */}
            <span className="compare-label label-original">Original</span>
            <span className="compare-label label-enhanced">Enhanced</span>
            
            {/* Hidden range input for accessibility */}
            <input
              type="range"
              min="0"
              max="100"
              value={comparePosition}
              onChange={handleSliderChange}
              className="compare-range"
              aria-label="Compare slider"
            />
          </div>
        </motion.div>

        <motion.div
          className="preview-info"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="info-text">
            Your {milestone?.name?.toLowerCase() || 'special'} moment has been transformed 
            into a cinematic, ultra-realistic scene.
          </p>
          <div className="info-tags">
            <span className="tag">4K Ultra-HD</span>
            <span className="tag">AI Enhanced</span>
            <span className="tag">Cinematic</span>
          </div>
        </motion.div>

        <motion.div
          className="preview-actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <button className="action-btn primary" onClick={handleDownload}>
            {saved ? (
              <>
                <Check size={20} strokeWidth={1.5} />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Download size={20} strokeWidth={1.5} />
                <span>Save to Gallery</span>
              </>
            )}
          </button>
          
          <div className="action-row">
            <button className="action-btn secondary" onClick={handleShare}>
              <Share2 size={20} strokeWidth={1.5} />
              <span>Share</span>
            </button>
            <button className="action-btn secondary" onClick={onNewPhoto}>
              <Camera size={20} strokeWidth={1.5} />
              <span>New Photo</span>
            </button>
          </div>
        </motion.div>

        <motion.button
          className="toggle-view"
          onClick={() => setShowOriginal(!showOriginal)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {showOriginal ? 'Show Enhanced' : 'Show Original Only'}
        </motion.button>
      </main>
    </motion.div>
  );
}

export default PreviewScreen;

