import { useRef, useState } from 'react';
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
  X
} from 'lucide-react';
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
  onGenerate 
}) {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('home');
  const [dragActive, setDragActive] = useState(false);

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
            <div className="empty-gallery">
              <Image size={48} strokeWidth={1} />
              <p>No memories yet</p>
              <span>Transform your first photo to start your collection</span>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="section-header">
              <h1>Settings</h1>
              <p>Customize your experience</p>
            </div>
            <div className="settings-placeholder">
              <Settings size={48} strokeWidth={1} />
              <p>Settings coming soon</p>
            </div>
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

