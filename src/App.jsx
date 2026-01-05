import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Welcome from './pages/Welcome';
import MainApp from './pages/MainApp';
import LoadingScreen from './components/LoadingScreen';
import PreviewScreen from './pages/PreviewScreen';
import ErrorScreen from './components/ErrorScreen';
import { enhanceImage, isAPIConfigured } from './api/nanoBananaPro';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleGetStarted = () => {
    setCurrentScreen('main');
  };

  const handleImageSelect = (imageData) => {
    setSelectedImage(imageData);
  };

  const handleMilestoneSelect = (milestone) => {
    setSelectedMilestone(milestone);
  };

  const handleGenerate = async () => {
    if (selectedImage && selectedMilestone) {
      setCurrentScreen('loading');
      setError(null);

      // Check if API is configured
      if (!isAPIConfigured()) {
        // Fallback: use original image if API not configured
        console.warn('Nano Banana Pro API key not configured. Using original image.');
        setTimeout(() => {
          setProcessedImage(selectedImage);
          setCurrentScreen('preview');
        }, 3000);
        return;
      }

      try {
        // Call Nano Banana Pro API to enhance the image
        const enhancedImageUrl = await enhanceImage(selectedImage, selectedMilestone.id);
        setProcessedImage(enhancedImageUrl);
        setCurrentScreen('preview');
      } catch (err) {
        console.error('Failed to enhance image:', err);
        setError(err.message || 'Failed to enhance image. Please try again.');
        setCurrentScreen('error');
      }
    }
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
    setProcessedImage(null);
    setSelectedMilestone(null);
    setError(null);
  };

  const handleNewPhoto = () => {
    setCurrentScreen('main');
    setSelectedImage(null);
    setSelectedMilestone(null);
    setProcessedImage(null);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <Welcome key="welcome" onGetStarted={handleGetStarted} />
        )}
        {currentScreen === 'main' && (
          <MainApp
            key="main"
            selectedImage={selectedImage}
            selectedMilestone={selectedMilestone}
            onImageSelect={handleImageSelect}
            onMilestoneSelect={handleMilestoneSelect}
            onGenerate={handleGenerate}
          />
        )}
        {currentScreen === 'loading' && (
          <LoadingScreen key="loading" milestone={selectedMilestone} />
        )}
        {currentScreen === 'preview' && (
          <PreviewScreen
            key="preview"
            originalImage={selectedImage}
            processedImage={processedImage}
            milestone={selectedMilestone}
            onBack={handleBackToMain}
            onNewPhoto={handleNewPhoto}
          />
        )}
        {currentScreen === 'error' && (
          <ErrorScreen
            key="error"
            message={error}
            onRetry={handleRetry}
            onBack={handleBackToMain}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
