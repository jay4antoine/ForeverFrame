import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Welcome from './pages/Welcome';
import MainApp from './pages/MainApp';
import LoadingScreen from './components/LoadingScreen';
import PreviewScreen from './pages/PreviewScreen';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleGetStarted = () => {
    setCurrentScreen('main');
  };

  const handleImageSelect = (imageData) => {
    setSelectedImage(imageData);
  };

  const handleMilestoneSelect = (milestone) => {
    setSelectedMilestone(milestone);
  };

  const handleGenerate = () => {
    if (selectedImage && selectedMilestone) {
      setCurrentScreen('loading');
      // Simulate AI processing time (10 seconds)
      setTimeout(() => {
        // For now, just use the same image
        setProcessedImage(selectedImage);
        setCurrentScreen('preview');
      }, 10000);
    }
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
    setProcessedImage(null);
    setSelectedMilestone(null);
  };

  const handleNewPhoto = () => {
    setCurrentScreen('main');
    setSelectedImage(null);
    setSelectedMilestone(null);
    setProcessedImage(null);
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
      </AnimatePresence>
    </div>
  );
}

export default App;
