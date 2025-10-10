# Gemini Clone with Firebase & Clerk Authentication

A React-based Gemini AI chat application with Firebase data storage and Clerk authentication.

## Features

- 🤖 Chat with Google's Gemini AI
- 🔐 User authentication with Clerk
- 💾 Data persistence with Firebase Firestore
- 📱 Responsive design
- 🎤 Voice input support
- 🖼️ Image upload and analysis
- 📝 Markdown rendering
- 📱 Mobile-friendly interface

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google Gemini API Key
REACT_APP_API=your_gemini_api_key_here

# Clerk Authentication
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Set up security rules for Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Get your Firebase configuration from Project Settings > General > Your apps

### 4. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Get your publishable key from the API Keys section
4. Configure your sign-in methods (email, Google, etc.)

### 5. Run the Application

```bash
npm start
```

## Data Structure

### Conversations Collection
```javascript
{
  id: "conversation_id",
  userId: "user_id",
  title: "Conversation Title",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Messages Collection
```javascript
{
  id: "message_id",
  conversationId: "conversation_id",
  sender: "You" | "Gemini",
  text: "Message content",
  timestamp: timestamp,
  image: File (optional)
}
```

## Features

- **Authentication**: Secure user authentication with Clerk
- **Data Persistence**: All conversations and messages stored in Firebase Firestore
- **Real-time Updates**: Messages and conversations sync across devices
- **Image Analysis**: Upload images for AI analysis
- **Voice Input**: Speech-to-text functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Markdown Support**: Rich text rendering for AI responses

## Technologies Used

- React 18
- Firebase Firestore
- Clerk Authentication
- Google Gemini AI API
- Tailwind CSS
- React Icons
- React Markdown

## Migration from localStorage

This version replaces localStorage with Firebase Firestore for:
- Better data persistence
- Multi-device synchronization
- User-specific data isolation
- Scalable data storage
- Real-time updates
