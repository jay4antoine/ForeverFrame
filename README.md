# ForeverFrame

Preserve Your Love Milestones with AI-Enhanced Memories.

ForeverFrame is a native iOS app that helps couples visually preview, enhance, and preserve their love milestones using ultra-realistic AI image generation powered by Nano Banana Pro.

## Features

- **Photo Upload** - Easily select photos from your camera roll
- **Milestone Selection** - Choose from various life milestones (First Date, Engagement, Wedding, Anniversary, etc.)
- **AI Enhancement** - Transform your photos into cinematic, ultra-realistic scenes using Nano Banana Pro
- **Before/After Comparison** - Interactive slider to see the transformation
- **Cloud Gallery** - All your memories stored securely in the cloud
- **User Authentication** - Sign in with Email, Google, or Apple
- **Save & Share** - Download enhanced photos or share directly with loved ones
- **Native iOS Experience** - Haptic feedback, native sharing, and iOS safe area support

## Tech Stack

### Frontend
- React 18
- Vite
- Capacitor (iOS native wrapper)
- Framer Motion (animations)
- Lucide React (icons)

### Backend (Supabase)
- PostgreSQL Database
- Row Level Security (RLS)
- Edge Functions (Deno)
- Authentication (Email, Google, Apple)
- Storage (for images)

### AI
- Nano Banana Pro API (image enhancement)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Xcode 15+ (for iOS development)
- macOS (required for iOS builds)
- Supabase account (free tier available)
- Nano Banana Pro API key

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

### Backend Setup

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
1. Create a Supabase project
2. Run database migrations
3. Configure storage
4. Deploy the Edge Function
5. Set up authentication providers

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

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        iOS App (Capacitor)                       │
├─────────────────────────────────────────────────────────────────┤
│                     React Frontend (Vite)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Welcome   │  │   MainApp   │  │   Preview/Gallery       │  │
│  │   Screen    │  │   + Upload  │  │   + Comparison          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                    Supabase Client Library                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Supabase                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │    Auth     │  │  Database   │  │       Storage           │  │
│  │   (Users)   │  │  (Images,   │  │   (Image files)         │  │
│  │             │  │   Edits)    │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Edge Function                             ││
│  │                  (enhance-image)                             ││
│  │                        │                                     ││
│  │                        ▼                                     ││
│  │              Nano Banana Pro API                             ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema

### Tables

**profiles** - User profiles (extends Supabase auth)
- `id`, `email`, `full_name`, `avatar_url`, `subscription_tier`, `images_generated`

**images** - Enhanced images
- `id`, `user_id`, `original_image_url`, `enhanced_image_url`, `milestone_id`, `milestone_name`, `prompt`, `status`, `metadata`

**edits** - Edit history (for future features)
- `id`, `image_id`, `edit_type`, `edit_params`, `result_image_url`

## Project Structure

```
ForeverFrame/
├── ios/                         # Native iOS project
├── supabase/
│   ├── functions/
│   │   └── enhance-image/       # Edge Function for AI processing
│   └── migrations/              # Database schema
├── src/
│   ├── api/                     # Local API (fallback)
│   ├── components/              # Reusable components
│   ├── context/                 # React contexts (Auth)
│   ├── lib/                     # Supabase client & utilities
│   └── pages/                   # Screen components
├── .env.example                 # Environment template
├── SUPABASE_SETUP.md           # Backend setup guide
└── README.md
```

## Security

- **API Key Protection**: Nano Banana Pro API key is stored securely in Supabase Edge Function secrets, never exposed to the client
- **Row Level Security**: All database tables have RLS policies ensuring users can only access their own data
- **Authenticated Requests**: All API calls require valid JWT tokens

## How AI Enhancement Works

Each milestone has a customized AI prompt:

| Milestone | Enhancement Style |
|-----------|-------------------|
| **First Date** | Romantic, golden hour lighting with cozy cafe/city ambiance |
| **Engagement** | Dreamy, ethereal atmosphere with elegant bridal photography |
| **Wedding Day** | Timeless, fairy-tale quality with classic wedding photography |
| **Anniversary** | Warm, nostalgic lighting evoking comfort and connection |
| **Vacation** | Vibrant, dramatic travel photography with cinematic composition |
| **Celebration** | Festive, energetic atmosphere with joyful, candid editorial |

All enhancements preserve original faces and identities while upgrading to 4K resolution.

## Future Enhancements

The database schema is designed to support future features:

- [ ] **Edit History** - Track all edits made to an image
- [ ] **Multiple Edit Types** - Add filters, adjustments, overlays
- [ ] **Undo/Redo** - Navigate through edit history
- [ ] **Collaboration** - Share galleries with partners
- [ ] **Subscription Tiers** - Premium features for paid users

## License

MIT License
