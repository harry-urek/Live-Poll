export type UserRole = 'student' | 'teacher';

export type AppState = 'welcome' | 'start' | 'loading' | 'question' | 'results' | 'addQuestion';

export interface QuestionData {
  id?: string;
  text: string;
  options: string[];
  timeLimit: number;
  correctAnswer?: number;
  serverTimestamp?: number;
  createdAt?: Date;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface PollResults {
  results: Record<string, number>;
  question: QuestionData;
  totalVotes?: number;
  totalStudents?: number;
}

export interface Student {
  id: string;
  name: string;
  answered: boolean;
  answer?: string;
  answeredAt?: Date;
  joinedAt: Date;
  isActive: boolean;
}

export interface HistoryQuestion extends QuestionData {
  results: Record<string, number>;
  completedAt: Date;
  totalStudents?: number;
  totalAnswered?: number;
}

export interface OptionResult {
  option: string;
  count: number;
  percentage: number;
  isCorrect: boolean;
}

export interface SocketEvents {
  // Student events
  'student:join': (data: { name: string }) => void;
  'student:submitAnswer': (answer: string) => void;
  'student:getHistory': () => void;
  
  // Teacher events
  'teacher:showWaiting': () => void;
  'teacher:askQuestion': (question: QuestionData) => void;
  'teacher:nextQuestion': () => void;
  'teacher:viewResults': () => void;
  'teacher:kickStudent': (socketId: string) => void;
  
  // Poll events
  'poll:joined': (data: { name: string }) => void;
  'poll:newQuestion': (question: QuestionData) => void;
  'poll:timeUpdate': (data: { timeLeft: number; serverTimestamp: number }) => void;
  'poll:waitingForQuestion': () => void;
  'poll:complete': (data: PollResults) => void;
  'poll:updateResults': (results: Record<string, number>) => void;
  'poll:studentList': (students: Record<string, Student>) => void;
  'poll:kicked': () => void;
  
  // History events
  'student:historyResponse': (history: HistoryQuestion[]) => void;
  
  // Chat events
  'chat:send': (data: { name: string; message: string }) => void;
  'chat:message': (data: { name: string; message: string; timestamp: number }) => void;
}

export interface AppConfig {
  socketUrl: string;
  questionMaxLength: number;
  maxOptions: number;
  minOptions: number;
  defaultTimeLimit: number;
  timeLimitOptions: number[];
}