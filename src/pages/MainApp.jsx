import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Image, 
  Upload, 
  Sparkles,
  Calendar,
  Gift,
  Star,
  Gem,
  Camera,
  Settings,
  FolderOpen,
  Home,
  X,
  LogOut,
  User,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserImages, deleteImage } from '../lib/database';
import { isSupabaseConfigured } from '../lib/supabase';
import './MainApp.css';

const milestones = [
  { id: 'first-date', name: 'First Date', icon: Heart, description: 'Where it all began' },
  { id: 'engagement', name: 'Engagement', icon: Gem, description: 'The magical proposal' },
  { id: 'wedding', name: 'Wedding Day', icon: Star, description: 'Your perfect day' },
  { id: 'anniversary', name: 'Anniversary', icon: Calendar, description: 'Celebrating love' },
  { id: 'vacation', name: 'Vacation', icon: Camera, description: 'Adventures together' },
  { id: 'celebration', name: 'Celebration', icon: Gift, description: 'Special moments' },
];

function MainApp({ 
  selectedImage, 
  selectedMilestone, 
  onImageSelect, 
  onMilestoneSelect, 
  onGenerate,
  onSignIn
}) {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('home');
  const [dragActive, setDragActive] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  const { user, signOut, isAuthenticated } = useAuth();

  // Fetch gallery images when tab changes to gallery
  useEffect(() => {
    if (activeTab === 'gallery' && isAuthenticated && isSupabaseConfigured()) {
      fetchGalleryImages();
    }
  }, [activeTab, isAuthenticated]);

  const fetchGalleryImages = async () => {
    if (!user) return;
    
    setGalleryLoading(true);
    try {
      const { data, error } = await getUserImages(user.id);
      if (error) throw error;
      setGalleryImages(data || []);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const { error } = await deleteImage(imageId);
      if (error) throw error;
      setGalleryImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedGalleryImage(null);
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageSelect(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onImageSelect(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const canGenerate = selectedImage && selectedMilestone;

  return (
    <motion.div
      className="main-app"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <header className="app-header">
        <div className="header-logo">
          <Heart size={20} strokeWidth={1.5} />
          <span>ForeverFrame</span>
        </div>
      </header>

      <main className="app-content">
        {activeTab === 'home' && (
          <div className="create-section">
            <div className="section-header">
              <h1>Create Your Memory</h1>
              <p>Upload a photo and select a milestone to transform it</p>
            </div>

            <div 
              className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedImage ? 'has-image' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={!selectedImage ? handleUploadClick : undefined}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              
              {selectedImage ? (
                <div className="image-preview">
                  <img src={selectedImage} alt="Selected" />
                  <button className="clear-image" onClick={handleClearImage}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">
                    <Upload size={32} strokeWidth={1.5} />
                  </div>
                  <p className="upload-text">Drop your photo here</p>
                  <p className="upload-hint">or click to browse</p>
                </div>
              )}
            </div>

            <div className="milestone-section">
              <h2 className="milestone-title">Select a Milestone</h2>
              <div className="milestone-grid">
                {milestones.map((milestone) => {
                  const Icon = milestone.icon;
                  const isSelected = selectedMilestone?.id === milestone.id;
                  return (
                    <motion.button
                      key={milestone.id}
                      className={`milestone-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => onMilestoneSelect(milestone)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="milestone-icon">
                        <Icon size={24} strokeWidth={1.5} />
                      </div>
                      <span className="milestone-name">{milestone.name}</span>
                      <span className="milestone-desc">{milestone.description}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.button
              className={`generate-button ${canGenerate ? 'active' : ''}`}
              onClick={canGenerate ? onGenerate : undefined}
              disabled={!canGenerate}
              whileHover={canGenerate ? { scale: 1.02 } : {}}
              whileTap={canGenerate ? { scale: 0.98 } : {}}
            >
              <Sparkles size={20} strokeWidth={1.5} />
              <span>Transform Photo</span>
            </motion.button>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="gallery-section">
            <div className="section-header">
              <h1>Your Gallery</h1>
              <p>All your transformed memories in one place</p>
            </div>
            
            {!isAuthenticated || !isSupabaseConfigured() ? (
              <div className="empty-gallery">
                <Image size={48} strokeWidth={1} />
                <p>Sign in to save memories</p>
                <span>Your gallery will sync across all devices</span>
              </div>
            ) : galleryLoading ? (
              <div className="gallery-loading">
                <div className="loading-spinner small" />
                <p>Loading your memories...</p>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="empty-gallery">
                <Image size={48} strokeWidth={1} />
                <p>No memories yet</p>
                <span>Transform your first photo to start your collection</span>
              </div>
            ) : (
              <div className="gallery-grid">
                {galleryImages.map((image) => (
                  <motion.div
                    key={image.id}
                    className="gallery-item"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedGalleryImage(image)}
                  >
                    <img 
                      src={image.enhanced_image_url || image.original_image_url} 
                      alt={image.milestone_name} 
                    />
                    <div className="gallery-item-overlay">
                      <span className="gallery-item-milestone">{image.milestone_name}</span>
                      <span className="gallery-item-date">{formatDate(image.created_at)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Gallery Image Detail Modal */}
            {selectedGalleryImage && (
              <motion.div
                className="gallery-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedGalleryImage(null)}
              >
                <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
                  <button 
                    className="modal-close"
                    onClick={() => setSelectedGalleryImage(null)}
                  >
                    <X size={24} />
                  </button>
                  <img 
                    src={selectedGalleryImage.enhanced_image_url} 
                    alt={selectedGalleryImage.milestone_name} 
                  />
                  <div className="modal-info">
                    <h3>{selectedGalleryImage.milestone_name}</h3>
                    <p>{formatDate(selectedGalleryImage.created_at)}</p>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteImage(selectedGalleryImage.id)}
                    >
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="section-header">
              <h1>Settings</h1>
              <p>Manage your account</p>
            </div>
            
            {isAuthenticated ? (
              <div className="settings-content">
                <div className="settings-profile">
                  <div className="profile-avatar">
                    <User size={32} strokeWidth={1.5} />
                  </div>
                  <div className="profile-info">
                    <p className="profile-name">
                      {user?.user_metadata?.full_name || 'ForeverFrame User'}
                    </p>
                    <p className="profile-email">{user?.email}</p>
                  </div>
                </div>

                <div className="settings-list">
                  <div className="settings-group">
                    <h3>Account</h3>
                    <button className="settings-item">
                      <User size={20} strokeWidth={1.5} />
                      <span>Edit Profile</span>
                      <ChevronRight size={20} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="settings-group">
                    <h3>App</h3>
                    <button className="settings-item">
                      <Image size={20} strokeWidth={1.5} />
                      <span>Image Quality</span>
                      <ChevronRight size={20} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="settings-group">
                    <button 
                      className="settings-item danger"
                      onClick={handleSignOut}
                    >
                      <LogOut size={20} strokeWidth={1.5} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="settings-signin">
                <div className="signin-icon">
                  <User size={48} strokeWidth={1} />
                </div>
                <h2>Sign in to ForeverFrame</h2>
                <p>Save your memories to the cloud and access them on any device</p>
                <button className="signin-button" onClick={onSignIn}>
                  Sign In or Create Account
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={24} strokeWidth={1.5} />
          <span>Create</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <FolderOpen size={24} strokeWidth={1.5} />
          <span>Gallery</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={24} strokeWidth={1.5} />
          <span>Settings</span>
        </button>
      </nav>
    </motion.div>
  );
}

export default MainApp;
