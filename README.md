# Collaborative Todo App

A real-time collaborative Kanban board application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time updates.

## 🚀 Features

### Core Features
- **Real-time Collaboration**: Multiple users can work on the same board simultaneously
- **Kanban Board**: Drag and drop tasks between Todo, In Progress, and Done columns
- **Smart Assignment**: Automatically assigns tasks to the least busy user
- **Conflict Resolution**: Handles simultaneous edits with conflict detection and resolution
- **Activity Logging**: Tracks all actions with real-time updates
- **User Authentication**: JWT-based auth with Google OAuth support

### Technical Features
- **Socket.IO**: Real-time bidirectional communication
- **Conflict Detection**: Version-based conflict resolution
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Framer Motion
- **State Management**: Zustand for client-side state management

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Socket.IO** for real-time updates
- **JWT** for authentication
- **Firebase Admin** for Google OAuth
- **bcryptjs** for password hashing

### Frontend
- **React 19** with Vite
- **Socket.IO Client** for real-time updates
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Firebase project (for Google OAuth)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd collabrator-todo-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/collaborative-todo
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_APPLICATION_CREDENTIALS=./src/lib/serviceAccountKey.json
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Firebase Setup
1. Create a Firebase project
2. Enable Google Authentication
3. Download your service account key and place it in `backend/src/lib/serviceAccountKey.json`
4. Add your Firebase config to the frontend `.env` file

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server:**
```bash
cd backend
npm run dev
```

2. **Start the frontend development server:**
```bash
cd frontend
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:5173`

### Production Mode

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Start the production server:**
```bash
cd backend
npm start
```

## 🎯 How It Works

### Real-time Collaboration
- Users connect to the Socket.IO server upon login
- All task operations (create, update, delete, assign) are broadcasted to all connected clients
- The activity log updates in real-time showing the last 20 actions

### Smart Assignment
- When a user clicks "Smart Assign", the system:
  1. Counts active tasks (todo + in-progress) for each user
  2. Assigns the task to the user with the fewest active tasks
  3. Updates the task and broadcasts the change

### Conflict Resolution
- Each task has a version number that increments with each update
- When a user tries to update a task, the system checks if the version matches
- If versions don't match, a conflict modal appears allowing users to:
  - Use their changes (overwrite server version)
  - Use the server version (discard their changes)

### Task Validation
- Task titles must be unique
- Task titles cannot match column names (todo, in-progress, done)
- Descriptions must be at least 15 characters
- All fields are validated on both frontend and backend

## 📁 Project Structure

```
collabrator-todo-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── lib/            # Utilities and configurations
│   │   ├── middlewares/    # Authentication middleware
│   │   ├── models/         # MongoDB schemas
│   │   └── routes/         # API routes
│   └── index.js           # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities and configurations
│   │   ├── pages/         # Page components
│   │   ├── Store/         # Zustand stores
│   │   └── main.jsx       # App entry point
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Tasks
- `GET /api/task/all` - Get all tasks
- `POST /api/task/create` - Create new task
- `PATCH /api/task/update/:id` - Update task
- `DELETE /api/task/delete/:id` - Delete task
- `POST /api/task/assign/:id` - Assign task to user
- `POST /api/task/smart-assign/:id` - Smart assign task

### Actions
- `GET /api/action/last-20` - Get last 20 actions

## 🎨 UI Components

### KanbanBoard
- Main board component with three columns
- Drag and drop functionality
- Real-time updates

### TaskCard
- Individual task display
- Edit and delete actions
- Smart assign button
- Priority and due date display

### ActivityLog
- Real-time activity feed
- Shows last 20 actions
- Color-coded action types

### Modals
- CreateTaskModal: Form for creating new tasks
- EditTaskModal: Form for editing tasks with conflict resolution

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Secure cookie settings

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Connect your repository
2. Set environment variables
3. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables
5. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ using the MERN stack and Socket.IO** 