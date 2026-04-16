# DebateSphere

AI-powered debating platform with a professional debate stage interface. Engage in structured debates with AI opponents or other users, featuring real-time communication, audience voting, and comprehensive analytics.

![DebateSphere](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express-4-green?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)

## 🚀 Core Features

*   **AI-Powered Debates**: Engage with advanced AI opponents using the powerful Llama 3.3 70B model via Groq API.
*   **Multiple Debate Modes**: Choose from User vs AI, AI vs AI, or real-time User vs User debates.
*   **Structured Rounds**: Experience formal debate structure with Opening, Rebuttal, Crossfire, and Closing rounds.
*   **Live Audience Voting**: Cast your vote and see real-time results as the audience decides the winner.
*   **AI Personalities**: Face off against Logical, Emotional, Diplomatic, or Aggressive AI opponents.
*   **Debate Analytics**: Track your performance with detailed statistics and win/loss records.
*   **User Authentication**: Implemented using Firebase Authentication. The backend verifies Firebase ID tokens using the Firebase Admin SDK.
*   **Professional UI**: TED-style debate stage design with glassmorphism effects.

## 🛠️ Tech Stack

**Frontend:**

*   Next.js (App Router)
*   React
*   TypeScript
*   Tailwind CSS
*   Firebase Web SDK
*   Axios
*   Framer Motion
*   Socket.io Client

**Backend:**

*   Node.js
*   Express
*   TypeScript
*   MongoDB Atlas (Mongoose)
*   Firebase Admin SDK
*   Groq API
*   Socket.io
*   Helmet, CORS, Express Rate Limit

## 📁 Project Structure

```
debate-sphere/
├── backend/
│   ├── src/
│   │   ├── config/             # Database and Firebase configurations
│   │   ├── controllers/        # Express route handlers
│   │   ├── middleware/         # Authentication, error, and rate limit middleware
│   │   ├── models/             # Mongoose schemas and models
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Groq AI and Socket.io services
│   │   ├── utils/              # Utility functions and validators
│   │   └── server.ts           # Main Express server entry point
│   ├── tests/                # Backend unit and integration tests
│   ├── .env.example          # Example environment variables for backend
│   ├── package.json
│   ├── render.yaml           # Render deployment configuration
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages and layouts
│   │   ├── components/         # Reusable React components
│   │   ├── context/            # React Context providers (Auth, Debate)
│   │   ├── lib/                # Firebase client, API client, and utility functions
│   │   ├── styles/             # Global CSS and Tailwind directives
│   │   └── types/              # Custom TypeScript types (e.g., Debate, Message)
│   ├── .env.example          # Example environment variables for frontend
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Firebase project with Authentication enabled
- Groq API key

### 1. Clone the repository

```bash
git clone https://github.com/kmanaswini6/debate-sphere.git
cd debate-sphere
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit the `.env` file with your credentials:

```
PORT=3001
MONGO_URI=<MongoDB Atlas Connection String>
FIREBASE_PROJECT_ID=<Firebase Project ID>
FIREBASE_CLIENT_EMAIL=<Firebase Service Account Email>
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GROQ_API_KEY=<Groq API Key>
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

**Note on `FIREBASE_PRIVATE_KEY`**: Ensure the private key is a single line with `\n` replacing actual newlines.

To run the backend locally:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env.local
```

Edit the `.env.local` file with your Firebase client-side configuration and backend API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=<Firebase API Key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<Firebase Auth Domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<Firebase Project ID>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<Firebase Storage Bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<Firebase Sender ID>
NEXT_PUBLIC_FIREBASE_APP_ID=<Firebase App ID>
```

To run the frontend locally:

```bash
npm run dev
```

## 🚀 Deployment

### Backend (Render)

The `backend/render.yaml` file contains the configuration for deploying the backend to Render. Ensure your environment variables are set correctly on Render.

**Health Check Endpoint:** `/api/health`

### Frontend (Vercel)

Deploy the Next.js frontend to Vercel. Ensure `NEXT_PUBLIC_API_URL` points to your deployed Render backend URL and all `NEXT_PUBLIC_FIREBASE_*` variables are configured in Vercel.

## 💡 API Endpoints

All backend API endpoints are prefixed with `/api`.

### Authentication

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Log in a user.
*   `POST /api/auth/verify`: Verify a Firebase token.
*   `GET /api/auth/profile`: Get the current user's profile (requires authentication).

### Debates

*   `POST /api/debate`: Create a new debate.
*   `GET /api/debate/history`: Get user's debate history.
*   `GET /api/debate/:id`: Get a specific debate by ID.
*   `POST /api/debate/:id/argument`: Add an argument to a debate.
*   `POST /api/debate/:id/respond`: Get an AI response for a debate.
*   `POST /api/debate/:id/status`: Update debate status.
*   `POST /api/debate/:id/next-round`: Advance to the next round in a debate.

### Voting

*   `POST /api/vote`: Submit a vote for a debate.
*   `GET /api/vote/:debateId`: Get current vote counts for a debate.

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

## ✅ Production Readiness Checklist

*   [x] All TypeScript errors resolved.
*   [x] Unused parameters prefixed with underscores (`_req`, `_res`).
*   [x] Unused imports removed.
*   [x] Strict typing enforced.
*   [x] Firebase Admin SDK initialization verified with private key `\n` replacement.
*   [x] Frontend Firebase configuration confirmed.
*   [x] Firebase ID tokens sent in `Authorization` header via Axios interceptor.
*   [x] `MONGO_URI` (or `MONGODB_URI`) validation and connection in `connectDB()`.
*   [x] Mongoose schemas and models correctly defined.
*   [x] Groq AI service verified, including `/api/debate/generate` endpoint.
*   [x] Proper error handling and response validation for Groq AI.
*   [x] Express routes (`/api/auth`, `/api/debate`, `/api/vote`) confirmed.
*   [x] Functional `/api/health` endpoint added.
*   [x] Rate limiting and global error handling validated.
*   [x] CORS configured for local and production environments.
*   [x] Socket.io initialization and event handling verified for production compatibility.
*   [x] Next.js App Router compatibility confirmed.
*   [x] `next/router` usage replaced with `next/navigation` where applicable.
*   [x] Tailwind CSS configuration and font loading validated.
*   [x] Axios interceptor correctly adds Firebase tokens to requests.
*   [x] `layout.tsx` correctly wraps providers and global styles.
*   [x] `.env` and `.env.local` included in `.gitignore`.
*   [x] Usage of Helmet and rate limiting validated.
*   [ ] User inputs sanitized (manual review recommended for specific inputs).
*   [x] `backend/render.yaml` validated.
*   [x] `npm run build` and `npm start` scripts exist in backend.
*   [x] Environment variables properly referenced in backend deployment.
*   [x] `NEXT_PUBLIC_API_URL` points to the deployed backend in frontend.
*   [x] Frontend environment variables and production build validated.
*   [x] Professional `README.md` generated.

## 📝 License

MIT License - feel free to use this project for learning or production.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for fast AI inference
- [Firebase](https://firebase.google.com/) for authentication
- [MongoDB](https://mongodb.com/) for database
- [Next.js](https://nextjs.org/) for the frontend framework
- [Socket.io](https://socket.io/) for real-time communication
