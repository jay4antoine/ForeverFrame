# ForeverFrame

Preserve Your Love Milestones with AI-Enhanced Memories.

ForeverFrame is a native iOS app that helps couples visually preview, enhance, and preserve their love milestones using ultra-realistic AI image generation powered by Nano Banana Pro.

## Features

- **Photo Upload** - Easily select photos from your camera roll
- **Milestone Selection** - Choose from various life milestones (First Date, Engagement, Wedding, Anniversary, etc.)
- **AI Enhancement** - Transform your photos into cinematic, ultra-realistic scenes using Nano Banana Pro
- **Before/After Comparison** - Interactive slider to see the transformation
- **Save & Share** - Download enhanced photos or share directly with loved ones
- **Native iOS Experience** - Haptic feedback, native sharing, and iOS safe area support

## Tech Stack

- React 18
- Vite
- Capacitor (iOS native wrapper)
- Framer Motion (animations)
- Lucide React (icons)
- Nano Banana Pro API (AI image enhancement)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Xcode 15+ (for iOS development)
- macOS (required for iOS builds)
- Nano Banana Pro API key (get one at https://api.nanobananapro.site/)

### Installation

```bash
# Clone the repository
git clone https://github.com/jay4antoine/ForeverFrame.git

# Navigate to project directory
cd ForeverFrame

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### API Configuration

1. Sign up for an account at [Nano Banana Pro](https://api.nanobananapro.site/)
2. Get your API key from the dashboard
3. Add your API key to the `.env` file:

```bash
VITE_NANO_BANANA_PRO_API_KEY=your_api_key_here
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

## How the AI Enhancement Works

ForeverFrame uses Nano Banana Pro's advanced AI to transform your photos based on the selected milestone:

| Milestone | Enhancement Style |
|-----------|-------------------|
| **First Date** | Romantic, golden hour lighting with cozy cafe/city ambiance |
| **Engagement** | Dreamy, ethereal atmosphere with elegant bridal photography lighting |
| **Wedding Day** | Timeless, fairy-tale quality with classic wedding photography style |
| **Anniversary** | Warm, nostalgic lighting evoking comfort and deep connection |
| **Vacation** | Vibrant, dramatic travel photography with cinematic composition |
| **Celebration** | Festive, energetic atmosphere with joyful, candid editorial style |

All enhancements preserve the original subjects' faces and identities while upgrading the overall scene to ultra-high quality 4K resolution.

## Project Structure

```
ForeverFrame/
├── ios/                         # Native iOS project
│   └── App/
│       └── App/
│           ├── AppDelegate.swift
│           └── public/          # Built web assets
├── src/
│   ├── api/
│   │   └── nanoBananaPro.js     # Nano Banana Pro API integration
│   ├── components/
│   │   ├── LoadingScreen.jsx    # Full-screen loading animation
│   │   └── ErrorScreen.jsx      # Error handling screen
│   ├── pages/
│   │   ├── Welcome.jsx          # Welcome/landing screen
│   │   ├── MainApp.jsx          # Main interface with upload & milestones
│   │   └── PreviewScreen.jsx    # Before/after comparison view
│   ├── App.jsx                  # Main app component with routing
│   ├── App.css                  # Global app styles
│   ├── index.css                # Base styles & CSS variables
│   └── main.jsx                 # Entry point
├── .env.example                 # Environment variables template
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

## API Rate Limits

Be aware of your Nano Banana Pro API usage limits. Each image enhancement counts as one API call. Monitor your usage through the Nano Banana Pro dashboard.

## Troubleshooting

### "API key not configured" error
Make sure you've created a `.env` file with your API key. Copy from `.env.example` and add your key.

### Image enhancement fails
- Check your internet connection
- Verify your API key is valid
- Ensure the image file isn't too large (recommended: under 10MB)
- Try a different image

### iOS build fails
- Make sure Xcode is up to date
- Run `npm run ios:build` to sync web assets
- Open Xcode and check for any signing/provisioning issues

## Roadmap

- [ ] Add gallery persistence with Core Data
- [ ] Implement user accounts
- [ ] Add more milestone options
- [ ] Camera integration for direct photo capture
- [ ] iCloud sync
- [ ] Multiple image fusion support

## License

MIT License
