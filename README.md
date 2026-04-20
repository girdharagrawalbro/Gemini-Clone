# GeminiClone

A powerful Gemini AI chat application built with React, Node.js, Express, and MongoDB.

## Features

- 🤖 **Chat with Gemini**: Powered by Google's Generative AI.
- 🔐 **OAuth Authentication**: Secure sign-in with Google.
- 💾 **Database Persistence**: Your conversations are saved in MongoDB.
- 🎤 **Voice Input**: Talk to Gemini using your microphone.
- 🖼️ **Image Analysis**: Upload images for Gemini to analyze.
- 📝 **Markdown Support**: Beautifully rendered AI responses.
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop.

## Technologies Used

- **Frontend**: React, Axios, React Markdown, Tailwind CSS, React Icons.
- **Backend**: Node.js, Express, Passport.js (Google OAuth), JWT, Mongoose.
- **Database**: MongoDB.
- **AI**: Google Generative AI (@google/generative-ai).

## Setup Instructions

### 1. Prerequisites
- Node.js (v16 or higher)
- MongoDB Community Server (installed and running)

### 2. Install Dependencies
```bash
# Install root and frontend dependencies
npm install

# Install backend dependencies
npm run install-backend
```

### 3. Environment Configuration

You need to set up two environment files:

#### Frontend (`.env` in root)
```env
REACT_APP_API=your_gemini_api_key
REACT_APP_API_URL=http://localhost:5000/api
```

#### Backend (`backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/geminiclone
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### 4. Running the Application

To run both the frontend and backend together:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Scripts

- `npm run dev`: Starts both frontend and backend concurrently.
- `npm start`: Starts only the React frontend.
- `npm run server`: Starts only the Node Express backend.
- `npm run install-backend`: Installs dependencies for the backend.
