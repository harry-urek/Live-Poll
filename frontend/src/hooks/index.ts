import { useState, useEffect, useCallback } from "react";
import { socketService } from "../services/socketService";
import type {
  QuestionData,
  PollResults,
  HistoryQuestion,
  UserRole,
} from "../types";
import { USER_ROLES } from "../constants";

/**
 * Custom hook for managing socket connection and student functionality
 */
export const useStudentSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null
  );
  const [serverTimeLeft, setServerTimeLeft] = useState<number>(0);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        await socketService.connect();
        setIsConnected(true);
        setupEventListeners();
      } catch (error) {
        console.error("Failed to connect socket:", error);
        setIsConnected(false);
      }
    };

    connectSocket();

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
      setIsConnected(false);
    };
  }, []);

  const setupEventListeners = useCallback(() => {
    socketService.onPollJoined(() => {
      setIsWaiting(true);
    });

    socketService.onNewQuestion((question: QuestionData) => {
      setCurrentQuestion(question);
      setServerTimeLeft(question.timeLimit || 60);
      setIsWaiting(false);
      setPollResults(null);
    });

    socketService.onTimeUpdate(({ timeLeft }) => {
      setServerTimeLeft(timeLeft);
    });

    socketService.onWaitingForQuestion(() => {
      setCurrentQuestion(null);
      setServerTimeLeft(0);
      setIsWaiting(true);
      setPollResults(null);
    });

    socketService.onPollComplete((data: PollResults) => {
      setPollResults(data);
      setServerTimeLeft(0);
    });

    socketService.onKicked(() => {
      alert("You have been removed from the poll session.");
      window.location.reload();
    });
  }, []);

  const joinPoll = useCallback((name: string) => {
    socketService.joinPoll(name);
  }, []);

  const submitAnswer = useCallback((answer: string) => {
    socketService.submitAnswer(answer);
  }, []);

  return {
    isConnected,
    currentQuestion,
    serverTimeLeft,
    pollResults,
    isWaiting,
    joinPoll,
    submitAnswer,
  };
};

/**
 * Custom hook for managing teacher socket functionality
 */
export const useTeacherSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        await socketService.connect();
        setIsConnected(true);
      } catch (error) {
        console.error("Failed to connect socket:", error);
        setIsConnected(false);
      }
    };

    connectSocket();

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
      setIsConnected(false);
    };
  }, []);

  const showWaiting = useCallback(() => {
    socketService.showWaiting();
  }, []);

  const askQuestion = useCallback(
    async (question: QuestionData) => {
      if (!isConnected || isSubmitting) return;

      setIsSubmitting(true);

      // First show waiting message
      showWaiting();

      // Delay before asking question
      setTimeout(() => {
        socketService.askQuestion(question);

        // Reset submitting state after question is sent
        setTimeout(() => {
          setIsSubmitting(false);
        }, 2000);
      }, 1000);
    },
    [isConnected, isSubmitting, showWaiting]
  );

  const nextQuestion = useCallback(() => {
    socketService.nextQuestion();
  }, []);

  const viewResults = useCallback(() => {
    socketService.viewResults();
  }, []);

  return {
    isConnected,
    isSubmitting,
    askQuestion,
    nextQuestion,
    viewResults,
    getSocket: () => socketService.getSocket(),
  };
};

/**
 * Custom hook for managing poll history
 */
export const usePollHistory = () => {
  const [history, setHistory] = useState<HistoryQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socketService.onHistoryResponse((historyData: HistoryQuestion[]) => {
      setHistory(historyData);
      setLoading(false);
    });

    return () => {
      socketService.offHistoryResponse();
    };
  }, []);

  const fetchHistory = useCallback(() => {
    setLoading(true);
    socketService.getHistory();
  }, []);

  return {
    history,
    loading,
    fetchHistory,
  };
};

/**
 * Custom hook for managing question form state
 */
export const useQuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [timeLimit, setTimeLimit] = useState(60);
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const addOption = useCallback(() => {
    if (options.length < 6) {
      setOptions((prev) => [...prev, { text: "", isCorrect: false }]);
    }
  }, [options.length]);

  const removeOption = useCallback(
    (index: number) => {
      if (options.length > 2) {
        setOptions((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [options.length]
  );

  const updateOption = useCallback((index: number, text: string) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index].text = text;
      return newOptions;
    });
  }, []);

  const setCorrectAnswer = useCallback((index: number, isCorrect: boolean) => {
    setOptions((prev) =>
      prev.map((option, i) => ({
        ...option,
        isCorrect: i === index ? isCorrect : false,
      }))
    );
  }, []);

  const resetForm = useCallback(() => {
    setQuestion("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
  }, []);

  const isFormValid = useCallback(() => {
    if (!question.trim()) return false;
    if (options.every((opt) => !opt.text.trim())) return false;
    if (!options.some((opt) => opt.isCorrect)) return false;
    return true;
  }, [question, options]);

  return {
    question,
    setQuestion,
    timeLimit,
    setTimeLimit,
    options,
    addOption,
    removeOption,
    updateOption,
    setCorrectAnswer,
    resetForm,
    isFormValid,
  };
};

/**
 * Custom hook for managing app state and role selection
 */
export const useAppState = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentState, setCurrentState] = useState<
    "welcome" | "start" | "loading" | "question" | "results" | "addQuestion"
  >("welcome");

  const handleRoleSelect = useCallback((role: UserRole) => {
    setUserRole(role);
    if (role === USER_ROLES.STUDENT) {
      setCurrentState("start");
    } else if (role === USER_ROLES.TEACHER) {
      setCurrentState("addQuestion");
    }
  }, []);

  const handleStudentJoin = useCallback(() => {
    setCurrentState("loading");
  }, []);

  const handleQuestionReceived = useCallback(() => {
    setCurrentState("question");
  }, []);

  const handleWaitingForQuestion = useCallback(() => {
    setCurrentState("loading");
  }, []);

  return {
    userRole,
    currentState,
    setCurrentState,
    handleRoleSelect,
    handleStudentJoin,
    handleQuestionReceived,
    handleWaitingForQuestion,
  };
};
