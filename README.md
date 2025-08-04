# Live Polling System

A real-time interactive polling application built with React + TypeScript frontend and Node.js + Socket.IO backend. This system allows teachers to create live polls and students to participate in real-time voting sessions.

## 🚀 Features

### For Teachers
- **Create Interactive Questions**: Add multiple-choice questions with customizable options
- **Real-time Poll Management**: Start polls, set time limits, and manage active sessions
- **Live Results Tracking**: View real-time responses and student participation
- **Poll History**: Access complete history of previous polls and results
- **Student Management**: View connected students and manage participants
- **Flexible Time Controls**: Set custom time limits (30s, 60s, 90s, 120s) for questions

### For Students
- **Easy Join Process**: Simple name-based entry to join polling sessions
- **Real-time Participation**: Submit answers during live polling sessions
- **Instant Feedback**: View results immediately after poll completion
- **Responsive Interface**: Works seamlessly on desktop and mobile devices
- **Visual Results**: Animated progress bars and percentage displays

### System Features
- **Real-time Communication**: Powered by Socket.IO for instant updates
- **Responsive Design**: Built with Tailwind CSS and DaisyUI components
- **TypeScript Support**: Full type safety across frontend and backend
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Cross-platform**: Web-based application accessible from any device

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS components
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
harry-urek-live-poll/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── AddQuestion.tsx      # Teacher question creation
│   │   │   ├── Welcome.tsx          # Role selection screen
│   │   │   ├── Start.tsx            # Student join screen
│   │   │   ├── Question.tsx         # Active polling interface
│   │   │   ├── Results.tsx          # Poll results display
│   │   │   ├── Loading.tsx          # Loading states
│   │   │   ├── PollHistoryDrawer.tsx # Historical data view
│   │   │   └── QuestionResultDisplay.tsx # Result components
│   │   ├── hooks/            # Custom React hooks
│   │   │   └── index.ts      # Socket and state management hooks
│   │   ├── services/         # API and socket services
│   │   │   └── socketService.ts # Socket.IO client wrapper
│   │   ├── types/            # TypeScript type definitions
│   │   │   └── index.ts      # Application interfaces
│   │   ├── constants/        # Application constants
│   │   │   └── index.ts      # Config and event definitions
│   │   ├── utils/            # Utility functions
│   │   │   └── index.ts      # Helper functions
│   │   └── App.tsx           # Main application component
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite configuration
└── server/                   # Node.js backend
    ├── server.js             # Express server setup
    ├── pollSocket.js         # Socket.IO event handlers
    ├── pollModel.js          # Data model and business logic
    ├── pollController.js     # HTTP route controllers
    ├── utils/
    │   └── timer.js          # Timer utility functions
    └── package.json          # Backend dependencies
```

## 🚀 Quick Start


### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harry-urek/Live-Poll
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Development Setup

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - Choose your role (Student or Teacher) to begin

## 🎯 How to Use

### For Teachers

1. **Getting Started**
   - Select "I'm a Teacher" on the welcome screen
   - You'll be taken to the question creation interface

2. **Creating a Poll**
   - Enter your question in the text area
   - Add multiple choice options (minimum 2, maximum 6)
   - Mark the correct answer
   - Set a time limit for responses
   - Click "Ask Question" to start the poll

3. **Managing the Session**
   - View real-time student responses
   - Monitor participation rates
   - Access poll history through the history drawer
   - Control poll flow with next question options

### For Students

1. **Joining a Session**
   - Select "I'm a Student" on the welcome screen
   - Enter your name to join the polling session
   - Wait for the teacher to start a poll

2. **Participating in Polls**
   - Read the question carefully
   - Select your answer from the multiple choices
   - Submit before time runs out
   - View results after the poll ends

## 🔧 Configuration

### Local Development Setup

The application is configured to run locally with the following default ports:
- **Backend Server**: `http://localhost:5000`
- **Frontend Server**: `http://localhost:5173`

**Frontend Configuration** (`frontend/src/constants/index.ts`):
```typescript
export const APP_CONFIG: AppConfig = {
  socketUrl: "http://localhost:5000", // Backend URL
  questionMaxLength: 100,
  maxOptions: 6,
  minOptions: 2,
  defaultTimeLimit: 60,
  timeLimitOptions: [30, 60, 90, 120],
};
```

**Backend CORS Configuration** (`server/server.js`):
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite dev server
];
```

## 📦 Available Scripts

### Frontend Scripts
```bash
npm run dev        # Start development server on port 5173
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Backend Scripts
```bash
npm start          # Start production server on port 5000
npm run dev        # Start development server with nodemon
```

## 🏗️ Architecture

### Frontend Architecture
- **Component-based**: Modular React components for different app states
- **Custom Hooks**: Encapsulated logic for socket management and state
- **TypeScript**: Full type safety with interfaces and type definitions
- **Real-time Updates**: Socket.IO integration for live data synchronization

### Backend Architecture
- **Event-driven**: Socket.IO events for real-time communication
- **Session Management**: In-memory poll session management
- **RESTful API**: Express.js routes for HTTP operations
- **Modular Design**: Separated concerns with controllers, models, and socket handlers

### Key Components

**Frontend Components:**
- `Welcome.tsx` - Role selection interface
- `AddQuestion.tsx` - Teacher's question creation interface
- `Question.tsx` - Student's polling interface
- `Results.tsx` - Real-time results display
- `PollHistoryDrawer.tsx` - Historical poll data viewer

**Backend Modules:**
- `server.js` - Express server and Socket.IO setup
- `pollSocket.js` - Real-time event handling
- `pollModel.js` - Data models and business logic
- `pollController.js` - HTTP route handlers

## 🔐 Socket Events

### Student Events
- `student:join` - Join polling session
- `student:submitAnswer` - Submit poll response
- `student:getHistory` - Request poll history

### Teacher Events
- `teacher:showWaiting` - Show waiting state to students
- `teacher:askQuestion` - Start new poll
- `teacher:nextQuestion` - Move to next question
- `teacher:kickStudent` - Remove student from session

### Poll Events
- `poll:joined` - Student successfully joined
- `poll:newQuestion` - New poll started
- `poll:timeUpdate` - Timer synchronization
- `poll:complete` - Poll completed
- `poll:updateResults` - Live result updates

## 🚀 Local Development

### Running Both Servers

For the complete application experience, you need to run both servers:

1. **Terminal 1 - Backend Server**
   ```bash
   cd server
   npm run dev
   ```

2. **Terminal 2 - Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```

### Development Workflow

1. **Making Changes**
   - Frontend changes will hot-reload automatically via Vite
   - Backend changes will restart automatically via nodemon

2. **Testing Real-time Features**
   - Open multiple browser tabs to simulate multiple users
   - Use one tab as a teacher and others as students
   - Test the real-time polling functionality





