import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Welcome from './components/welcome';
import Start from './components/Start';
import Loading from './components/Loading';
import Question from './components/Question';
import AddQuestion from './components/addQuestion';


type UserRole = 'student' | 'teacher' | null;
type AppState = 'welcome' | 'start' | 'loading' | 'question' | 'results' | 'addQuestion';

interface QuestionData {
  text: string;
  options: string[];
  timeLimit: number;
  correctAnswer?: number;
  serverTimestamp?: number;
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [serverTimeLeft, setServerTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (userRole === 'student') {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);


      newSocket.on('connect', () => {
        console.log('Student socket connected:', newSocket.id);
      });


      newSocket.on('poll:joined', ({ name }) => {
        console.log('Successfully joined poll:', name);
        setCurrentState('loading');
      });


      newSocket.on('poll:newQuestion', (question: QuestionData) => {
        console.log('App.tsx: Received new question:', question);
        setCurrentQuestion(question);
        setServerTimeLeft(question.timeLimit || 60);
        setCurrentState('question');
      });


      // Handle server time updates for synchronized countdown
      newSocket.on('poll:timeUpdate', ({ timeLeft }: { timeLeft: number; serverTimestamp: number }) => {
        console.log('App.tsx: Received time update:', timeLeft);
        setServerTimeLeft(timeLeft);
      });

      newSocket.on('poll:waitingForQuestion', () => {
        console.log('App.tsx: Waiting for question...');
        setCurrentQuestion(null);
        setServerTimeLeft(0);
        setCurrentState('loading');
      });


      newSocket.on('poll:complete', (data) => {
        console.log('App.tsx: Question completed, transitioning to results/waiting:', data);
        setServerTimeLeft(0);

        setTimeout(() => {
          setCurrentQuestion(null);
          setCurrentState('loading');
        }, 2000);
      });

      // Handle connection errors
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
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
        return currentQuestion ? (
          <Question socket={socket} questionData={currentQuestion} serverTimeLeft={serverTimeLeft} />
        ) : (
          <Loading />
        );

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
