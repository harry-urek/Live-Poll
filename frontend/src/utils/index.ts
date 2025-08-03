import { QuestionData, OptionResult, HistoryQuestion } from "../types";
import { VALIDATION_RULES } from "../constants";

/**
 * Validates student name input
 */
export const validateStudentName = (name: string): boolean => {
  const trimmedName = name.trim();
  return (
    trimmedName.length >= VALIDATION_RULES.STUDENT_NAME.MIN_LENGTH &&
    trimmedName.length <= VALIDATION_RULES.STUDENT_NAME.MAX_LENGTH
  );
};

/**
 * Validates question text
 */
export const validateQuestion = (question: string): boolean => {
  const trimmedQuestion = question.trim();
  return (
    trimmedQuestion.length >= VALIDATION_RULES.QUESTION.MIN_LENGTH &&
    trimmedQuestion.length <= VALIDATION_RULES.QUESTION.MAX_LENGTH
  );
};

/**
 * Validates option text
 */
export const validateOption = (option: string): boolean => {
  const trimmedOption = option.trim();
  return (
    trimmedOption.length >= VALIDATION_RULES.OPTION.MIN_LENGTH &&
    trimmedOption.length <= VALIDATION_RULES.OPTION.MAX_LENGTH
  );
};

/**
 * Calculates poll results with percentages
 */
export const calculatePollResults = (
  results: Record<string, number>,
  question: QuestionData
): OptionResult[] => {
  const totalVotes = Object.values(results).reduce(
    (sum, count) => sum + count,
    0
  );

  return question.options.map((option, index) => ({
    option,
    count: results[option] || 0,
    percentage:
      totalVotes > 0
        ? Math.round(((results[option] || 0) / totalVotes) * 100)
        : 0,
    isCorrect:
      question.correctAnswer !== undefined && index === question.correctAnswer,
  }));
};

/**
 * Formats time remaining in MM:SS format
 */
export const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Gets color class for progress bars based on ranking and correctness
 */
export const getProgressBarColor = (
  index: number,
  isCorrect: boolean
): string => {
  if (isCorrect) return "bg-green-500";
  if (index === 0) return "bg-purple-500"; // Highest percentage
  if (index === 1) return "bg-blue-500"; // Second highest
  if (index === 2) return "bg-orange-500"; // Third highest
  return "bg-gray-500"; // Others
};

/**
 * Sorts poll results by percentage (highest first)
 */
export const sortResultsByPercentage = (
  results: OptionResult[]
): OptionResult[] => {
  return [...results].sort((a, b) => b.percentage - a.percentage);
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Generates unique ID for questions
 */
export const generateQuestionId = (): string => {
  return `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sanitizes user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Formats date for display
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Checks if question is valid for submission
 */
export const isQuestionValid = (
  question: string,
  options: { text: string; isCorrect: boolean }[]
): boolean => {
  if (!validateQuestion(question)) return false;

  const validOptions = options.filter((opt) => validateOption(opt.text));
  if (validOptions.length < 2) return false;

  const hasCorrectAnswer = options.some((opt) => opt.isCorrect);
  return hasCorrectAnswer;
};

/**
 * Creates a deep copy of an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(null, args);
    }
  };
};
