# ForeverFrame

Preserve Your Love Milestones with AI-Enhanced Memories.

ForeverFrame is a native iOS app that helps couples visually preview, enhance, and preserve their love milestones using ultra-realistic AI image generation powered by Nano Banana Pro.

## Features

- **Photo Upload** - Easily select photos from your camera roll
- **Milestone Selection** - Choose from various life milestones (First Date, Engagement, Wedding, Anniversary, etc.)
- **AI Enhancement** - Transform your photos into cinematic, ultra-realistic scenes
- **Before/After Comparison** - Interactive slider to see the transformation
- **Save & Share** - Download enhanced photos or share directly with loved ones
- **Native iOS Experience** - Haptic feedback, native sharing, and iOS safe area support

## Tech Stack

- React 18
- Vite
- Capacitor (iOS native wrapper)
- Framer Motion (animations)
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Xcode 15+ (for iOS development)
- macOS (required for iOS builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/jay4antoine/ForeverFrame.git

# Navigate to project directory
cd ForeverFrame

# Install dependencies
npm install
```

### Development (Web Preview)

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### iOS Development

```bash
# Build and sync to iOS
npm run ios:build

# Open in Xcode
npm run ios:open

# Or run directly on simulator/device
npm run ios:run
```

## Project Structure

```
ForeverFrame/
├── ios/                         # Native iOS project
│   └── App/
│       └── App/
│           ├── AppDelegate.swift
│           └── public/          # Built web assets
├── src/
│   ├── components/
│   │   └── LoadingScreen.jsx    # Full-screen loading animation
│   ├── pages/
│   │   ├── Welcome.jsx          # Welcome/landing screen
│   │   ├── MainApp.jsx          # Main interface with upload & milestones
│   │   └── PreviewScreen.jsx    # Before/after comparison view
│   ├── App.jsx                  # Main app component with routing
│   ├── App.css                  # Global app styles
│   ├── index.css                # Base styles & CSS variables
│   └── main.jsx                 # Entry point
├── capacitor.config.json        # Capacitor configuration
├── package.json
└── README.md
```

## Design Philosophy

ForeverFrame is designed to be:

- **Friendly** - Warm, inviting color palette with soft rose and sage tones
- **Minimal** - Clean interface that focuses on the content
- **Accessible** - Works for couples of all ages
- **Native** - Feels like a true iOS app with haptics and native gestures

## iOS-Specific Features

- Safe area insets for notch and home indicator
- Native haptic feedback on interactions
- Native share sheet
- Splash screen
- Status bar integration

## Roadmap

- [ ] Integrate Nano Banana Pro AI for actual image enhancement
- [ ] Add gallery persistence with Core Data
- [ ] Implement user accounts
- [ ] Add more milestone options
- [ ] Camera integration for direct photo capture
- [ ] iCloud sync

## License

MIT License
