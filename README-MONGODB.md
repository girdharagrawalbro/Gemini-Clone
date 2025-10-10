# GeminiClone - MongoDB Migration

This project has been migrated from Supabase to MongoDB with a local Node.js/Express backend.

## Prerequisites

### 1. Install MongoDB Community Server
Download and install MongoDB Community Server from: https://www.mongodb.com/try/download/community

**Windows Installation:**
1. Download the MongoDB Community Server installer
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install MongoDB as a Service (recommended)
5. Install MongoDB Compass (optional GUI tool)

### 2. Verify MongoDB Installation
Open a new command prompt/PowerShell and run:
```bash
mongod --version
```

## Project Setup

### 1. Install Dependencies
```bash
# Install main project dependencies
npm install

# Install backend dependencies
npm run install-backend
```

### 2. Environment Configuration
The project uses these environment files:

**Frontend (.env):**
```
REACT_APP_API=your_gemini_api_key
REACT_APP_API_URL=https://gemini-clone-yp44.onrender.com/api
REACT_APP_ENVIRONMENT=development
```

**Backend (backend/.env):**
```
MONGODB_URI=mongodb://localhost:27017/geminiclone
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
CLIENT_URL=https://gemini-girdhar.netlify.app
NODE_ENV=development
```

### 3. Start MongoDB Service
**Windows (if installed as service):**
MongoDB should start automatically. If not:
```bash
net start MongoDB
```

**Manual start:**
```bash
mongod --dbpath C:\data\db
```

### 4. Run the Application

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/signout` - User logout

### Conversations
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `PUT /api/conversations/:id` - Update conversation title
- `DELETE /api/conversations/:id` - Delete conversation

### Messages
- `GET /api/conversations/:id/messages` - Get conversation messages
- `POST /api/conversations/:id/messages` - Add message to conversation

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Conversations Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId (ref: Conversation),
  role: String ('user' | 'assistant'),
  content: String,
  timestamp: Date
}
```

## Migration Changes

### Removed
- Supabase client and dependencies
- Supabase authentication system
- Direct database queries from frontend

### Added
- MongoDB with Mongoose ODM
- Express.js backend API
- JWT-based authentication
- RESTful API endpoints
- Local database storage

### Updated Files
- `src/supabaseClient.js` → Now contains API client and auth methods
- `src/services/supabaseService.js` → Updated to use API endpoints
- `src/.env` → Updated environment variables
- `package.json` → Added development scripts

## Development Notes

1. **Authentication**: Uses JWT tokens stored in localStorage
2. **Database**: Local MongoDB instance on port 27017
3. **Backend**: Express server on port 5000
4. **Frontend**: React development server on port 3000
5. **CORS**: Configured to allow requests from frontend

## Troubleshooting

1. **MongoDB Connection Issues**: Ensure MongoDB service is running
2. **Port Conflicts**: Change ports in environment files if needed
3. **Authentication Issues**: Clear localStorage and try signing in again
4. **API Errors**: Check backend logs for detailed error messages

## Production Deployment

1. Change JWT_SECRET to a secure random string
2. Update MONGODB_URI to production database
3. Configure proper CORS origins
4. Set NODE_ENV=production
5. Use environment variables for sensitive data