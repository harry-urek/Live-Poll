import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Welcome from './components/welcome';
import Start from './components/Start';
import Loading from './components/Loading';
import Question from './components/Question';
import AddQuestion from './components/addQuestion';


type UserRole = 'student' | 'teacher' | null;
type AppState = 'welcome' | 'start' | 'loading' | 'question' | 'results' | 'addQuestion';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    // Initialize socket connection when user selects student role
    if (userRole === 'student') {
      const newSocket = io('http://localhost:5000'); // Adjust URL to match your server
      setSocket(newSocket);

      // Listen for question events
      newSocket.on('poll:newQuestion', () => {
        setCurrentState('question');
      });

      newSocket.on('poll:waitingForQuestion', () => {
        setCurrentState('loading');
      });

      return () => {
        newSocket.close();
      };
    }
  }, [userRole]);

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === 'student') {
      setCurrentState('start');
    } else if (role === 'teacher') {
      setCurrentState('addQuestion');
    }
  };
  const handleStudentJoin = (name: string) => {
    setStudentName(name);
    setCurrentState('loading');

    // Join the poll session
    if (socket) {
      socket.emit('student:join', { name });
    }
  };

  const renderCurrentComponent = () => {
    switch (currentState) {
      case 'welcome':
        return <Welcome onRoleSelect={handleRoleSelect} />;

      case 'start':
        return <Start onStudentJoin={handleStudentJoin} />;

      case 'loading':
        return <Loading />;

      case 'question':
        return <Question />;

      case 'addQuestion':
        return <AddQuestion />;

      default:
        return <Welcome onRoleSelect={handleRoleSelect} />;
    }
  };
  return (
    <div className=" ">
      {renderCurrentComponent()}
    </div>

  )
}

export default App
