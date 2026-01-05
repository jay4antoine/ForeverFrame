import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Welcome from './pages/Welcome';
import AuthScreen from './pages/AuthScreen';
import MainApp from './pages/MainApp';
import LoadingScreen from './components/LoadingScreen';
import PreviewScreen from './pages/PreviewScreen';
import ErrorScreen from './components/ErrorScreen';
import { enhanceImageViaBackend } from './lib/api';
import { uploadBase64Image, createImageRecord } from './lib/database';
import { isSupabaseConfigured } from './lib/supabase';
import { enhanceImage as enhanceImageLocal, isAPIConfigured } from './api/nanoBananaPro';
import './App.css';

function AppContent() {
  const { user, loading: authLoading, isAuthenticated, isConfigured } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [error, setError] = useState(null);

  // Handle authentication state changes
  useEffect(() => {
    if (!authLoading && isAuthenticated && currentScreen === 'auth') {
      setCurrentScreen('main');
    }
  }, [authLoading, isAuthenticated, currentScreen]);

  const handleGetStarted = () => {
    if (isConfigured && !isAuthenticated) {
      setCurrentScreen('auth');
    } else {
      setCurrentScreen('main');
    }
  };

  const handleAuthBack = () => {
    setCurrentScreen('welcome');
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

      try {
        let enhancedImageUrl;
        let imageId = null;

        // Check if backend is configured (Supabase)
        if (isSupabaseConfigured() && isAuthenticated) {
          // Upload original image to storage first
          const { data: uploadData, error: uploadError } = await uploadBase64Image(
            selectedImage,
            user.id,
            'originals'
          );

          if (uploadError) {
            console.warn('Failed to upload original image:', uploadError);
          }

          // Call backend Edge Function for secure AI processing
          const result = await enhanceImageViaBackend({
            imageUrl: uploadData?.url,
            imageBase64: selectedImage,
            milestoneId: selectedMilestone.id,
            milestoneName: selectedMilestone.name,
          });

          enhancedImageUrl = result.enhanced_image_url;
          imageId = result.image_id;
        } else if (isAPIConfigured()) {
          // Fallback to local API call if backend not configured
          console.warn('Using local API call - API key exposed in client');
          enhancedImageUrl = await enhanceImageLocal(selectedImage, selectedMilestone.id);
        } else {
          // Demo mode - just use original image
          console.warn('No API configured. Using original image for demo.');
          await new Promise(resolve => setTimeout(resolve, 3000));
          enhancedImageUrl = selectedImage;
        }

        setProcessedImage(enhancedImageUrl);
        setCurrentImageId(imageId);
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
    setCurrentImageId(null);
    setError(null);
  };

  const handleNewPhoto = () => {
    setCurrentScreen('main');
    setSelectedImage(null);
    setSelectedMilestone(null);
    setProcessedImage(null);
    setCurrentImageId(null);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="app">
        <div className="app-loading">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <Welcome key="welcome" onGetStarted={handleGetStarted} />
        )}
        {currentScreen === 'auth' && (
          <AuthScreen key="auth" onBack={handleAuthBack} />
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
            imageId={currentImageId}
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
