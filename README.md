# DebateSphere

AI-powered debating platform with a professional debate stage interface. Engage in structured debates with AI opponents or other users, featuring real-time communication, audience voting, and comprehensive analytics.

![DebateSphere](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express-4-green?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)

## 🎯 Features

- **AI-Powered Debates**: Engage with AI opponents powered by Llama 3.3 70B via Groq API
- **Multiple Debate Modes**: User vs AI, AI vs AI, or User vs User (real-time)
- **Structured Rounds**: Opening Statement, Rebuttal, Crossfire, and Closing Statement
- **AI Personalities**: Logical, Emotional, Diplomatic, and Aggressive styles
- **Live Audience Voting**: Real-time voting with visual results
- **Professional UI**: TED-style debate stage design with glassmorphism effects
- **Authentication**: Firebase Authentication (Google + Email/Password)
- **Analytics**: Track your debate history, wins, losses, and win rate

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State**: React Context + Zustand
- **Real-time**: Socket.io Client
- **Auth**: Firebase Authentication
- **Hosting**: Vercel

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB Atlas + Mongoose
- **Real-time**: Socket.io
- **AI**: Groq SDK (Llama 3.3 70B)
- **Auth**: Firebase Admin SDK
- **Hosting**: Render

## 📁 Project Structure

```
debate-sphere/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Firebase config
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, error handling, rate limiting
│   │   ├── services/        # Groq AI & Socket.io services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Entry point
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── render.yaml
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities & API clients
│   │   ├── styles/          # Global styles
│   │   └── types/           # TypeScript types
│   ├── public/
│   ├── package.json
│   └── next.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Firebase project with Authentication enabled
- Groq API key

### 1. Clone the Repository

```bash
cd debate-sphere
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=3001
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/debatesphere

# Firebase Admin SDK credentials
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"

# Groq API key
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key

# Frontend URL for CORS
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

```bash
npm run dev
```

Backend will start on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

## 🔑 API Keys Setup

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication (Google + Email/Password)
4. Download the web app configuration for frontend `.env`
5. Generate Admin SDK service account key for backend `.env`

### Groq API Setup

1. Go to [Groq Console](https://console.groq.com/)
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new API key
5. Add to backend `.env` as `GROQ_API_KEY`

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get the connection string
5. Replace username and password in `MONGO_URI`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/verify` | Verify Firebase token |
| GET | `/api/auth/profile` | Get user profile (protected) |

### Debates
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/debate` | Create new debate (protected) |
| GET | `/api/debate/history` | Get user's debates (protected) |
| GET | `/api/debate/:id` | Get single debate (protected) |
| POST | `/api/debate/:id/argument` | Add argument (protected) |
| POST | `/api/debate/:id/respond` | Get AI response (protected) |
| POST | `/api/debate/:id/status` | Update status (protected) |
| POST | `/api/debate/:id/next-round` | Advance round (protected) |

### Votes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vote` | Submit vote (protected) |
| GET | `/api/vote/:debateId` | Get vote counts |

## 🎮 Socket.io Events

### Client → Server
- `debate:join` - Join a debate room
- `debate:argument` - Broadcast new argument
- `debate:vote_update` - Broadcast vote update
- `debate:round_changed` - Broadcast round change
- `debate:timer_tick` - Sync timer

### Server → Client
- `debate:state` - Initial debate state
- `debate:new_argument` - New argument received
- `debate:votes_updated` - Vote counts updated
- `debate:round_changed` - Round advanced
- `debate:user_joined` - User joined room
- `debate:user_left` - User left room
- `debate:error` - Error occurred

## 🚢 Deployment

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set build command: `npm install && npm run build`
5. Set start command: `node dist/server.js`
6. Add all environment variables
7. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variables
5. Deploy

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🎨 UI Components

- **DebateStage**: Professional two-podium debate interface
- **ArgumentList**: Message display with speaker indicators
- **VotingPanel**: Real-time voting with percentage bars
- **RoundTimer**: Countdown timer with round indicators
- **Navbar**: Responsive navigation with auth state
- **Glass Cards**: Glassmorphism-styled containers

## 📊 Database Schema

### User
```typescript
{
  name: string;
  email: string;
  firebaseUid: string;
  stats: {
    debatesJoined: number;
    debatesWon: number;
    debatesLost: number;
    totalVotes: number;
  };
  achievements: string[];
}
```

### Debate
```typescript
{
  topic: string;
  mode: 'user-vs-ai' | 'ai-vs-ai' | 'user-vs-user';
  participants: ObjectId[];
  proSide: ObjectId[];
  conSide: ObjectId[];
  messages: Message[];
  status: 'active' | 'completed' | 'abandoned';
  winner?: 'pro' | 'con' | 'draw';
  votes: { pro: number; con: number };
  currentRound: 'opening' | 'rebuttal' | 'crossfire' | 'closing';
}
```

### Message
```typescript
{
  speaker: 'pro' | 'con' | 'moderator';
  content: string;
  round: string;
  timestamp: Date;
  isAI: boolean;
}
```

## 🔒 Security Features

- Firebase token verification for protected routes
- Rate limiting on API endpoints
- CORS configuration for cross-origin requests
- Input validation with express-validator
- Helmet.js for HTTP security headers
- MongoDB injection prevention via Mongoose

## 📝 License

MIT License - feel free to use this project for learning or production.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for fast AI inference
- [Firebase](https://firebase.google.com/) for authentication
- [MongoDB](https://mongodb.com/) for database
- [Next.js](https://nextjs.org/) for the frontend framework
- [Socket.io](https://socket.io/) for real-time communication
