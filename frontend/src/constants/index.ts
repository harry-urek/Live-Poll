import type { AppConfig } from "../types";

export const APP_CONFIG: AppConfig = {
  socketUrl: import.meta.env.VITE_SOCKET_URL,
  questionMaxLength: 100,
  maxOptions: 6,
  minOptions: 2,
  defaultTimeLimit: 60,
  timeLimitOptions: [30, 60, 90, 120],
};

export const POLL_STATES = {
  WELCOME: "welcome",
  START: "start",
  LOADING: "loading",
  QUESTION: "question",
  RESULTS: "results",
  ADD_QUESTION: "addQuestion",
} as const;

export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
} as const;

export const SOCKET_EVENTS = {
  // Student events
  STUDENT_JOIN: "student:join",
  STUDENT_SUBMIT_ANSWER: "student:submitAnswer",
  STUDENT_GET_HISTORY: "student:getHistory",

  // Teacher events
  TEACHER_SHOW_WAITING: "teacher:showWaiting",
  TEACHER_ASK_QUESTION: "teacher:askQuestion",
  TEACHER_NEXT_QUESTION: "teacher:nextQuestion",
  TEACHER_VIEW_RESULTS: "teacher:viewResults",
  TEACHER_KICK_STUDENT: "teacher:kickStudent",

  // Poll events
  POLL_JOINED: "poll:joined",
  POLL_NEW_QUESTION: "poll:newQuestion",
  POLL_TIME_UPDATE: "poll:timeUpdate",
  POLL_WAITING_FOR_QUESTION: "poll:waitingForQuestion",
  POLL_COMPLETE: "poll:complete",
  POLL_UPDATE_RESULTS: "poll:updateResults",
  POLL_STUDENT_LIST: "poll:studentList",
  POLL_KICKED: "poll:kicked",

  // History events
  STUDENT_HISTORY_RESPONSE: "student:historyResponse",

  // Chat events
  CHAT_SEND: "chat:send",
  CHAT_MESSAGE: "chat:message",
} as const;

export const UI_MESSAGES = {
  LOADING: "Wait for the teacher to ask questions..",
  SUBMITTED: "Answer Submitted! Waiting for results...",
  TIME_UP: "Time's up! Waiting for results...",
  LOADING_HISTORY: "Loading poll history...",
  NO_HISTORY: "No Poll History",
  NO_HISTORY_DESCRIPTION: "No completed polls to display yet.",
  CONNECTION_ERROR: "Connection error occurred",
  TEACHER_PREPARING: "Students are now waiting - teacher is preparing question",
} as const;

export const VALIDATION_RULES = {
  STUDENT_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  QUESTION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  OPTION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
} as const;
