# ForeverFrame

Preserve Your Love Milestones with AI-Enhanced Memories.

ForeverFrame is a modern web application that helps couples visually preview, enhance, and preserve their love milestones using ultra-realistic AI image generation powered by Nano Banana Pro.

## Features

- **Photo Upload** - Easily upload photos via drag & drop or file selection
- **Milestone Selection** - Choose from various life milestones (First Date, Engagement, Wedding, Anniversary, etc.)
- **AI Enhancement** - Transform your photos into cinematic, ultra-realistic scenes
- **Before/After Comparison** - Slider comparison to see the transformation
- **Save & Share** - Download enhanced photos or share directly with loved ones

## Tech Stack

- React 18
- Vite
- Framer Motion (animations)
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ForeverFrame.git

# Navigate to project directory
cd ForeverFrame

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
ForeverFrame/
├── src/
│   ├── components/
│   │   └── LoadingScreen.jsx    # Full-screen loading animation
│   ├── pages/
│   │   ├── Welcome.jsx          # Welcome/landing screen
│   │   ├── MainApp.jsx          # Main interface with upload & milestones
│   │   └── PreviewScreen.jsx    # Before/after comparison view
│   ├── styles/
│   ├── App.jsx                  # Main app component with routing
│   ├── App.css                  # Global app styles
│   ├── index.css                # Base styles & CSS variables
│   └── main.jsx                 # Entry point
├── package.json
└── README.md
```

## Design Philosophy

ForeverFrame is designed to be:

- **Friendly** - Warm, inviting color palette with soft rose and sage tones
- **Minimal** - Clean interface that focuses on the content
- **Accessible** - Works for couples of all ages
- **Elegant** - Typography and spacing that feels refined

## Roadmap

- [ ] Integrate Nano Banana Pro AI for actual image enhancement
- [ ] Add gallery persistence
- [ ] Implement user accounts
- [ ] Add more milestone options
- [ ] Social sharing integrations

## License

MIT License
