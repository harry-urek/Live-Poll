import { io, Socket } from "socket.io-client";
import type { QuestionData, HistoryQuestion, PollResults } from "../types";
import { APP_CONFIG, SOCKET_EVENTS } from "../constants";

export class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.socket = io(APP_CONFIG.socketUrl, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket?.id);
        this.reconnectAttempts = 0;
        resolve(this.socket!);
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        reject(error);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Student Events
  joinPoll(name: string): void {
    this.socket?.emit(SOCKET_EVENTS.STUDENT_JOIN, { name });
  }

  submitAnswer(answer: string): void {
    this.socket?.emit(SOCKET_EVENTS.STUDENT_SUBMIT_ANSWER, answer);
  }

  getHistory(): void {
    this.socket?.emit(SOCKET_EVENTS.STUDENT_GET_HISTORY);
  }

  // Teacher Events
  showWaiting(): void {
    this.socket?.emit(SOCKET_EVENTS.TEACHER_SHOW_WAITING);
  }

  askQuestion(question: QuestionData): void {
    this.socket?.emit(SOCKET_EVENTS.TEACHER_ASK_QUESTION, question);
  }

  nextQuestion(): void {
    this.socket?.emit(SOCKET_EVENTS.TEACHER_NEXT_QUESTION);
  }

  viewResults(): void {
    this.socket?.emit(SOCKET_EVENTS.TEACHER_VIEW_RESULTS);
  }

  kickStudent(socketId: string): void {
    this.socket?.emit(SOCKET_EVENTS.TEACHER_KICK_STUDENT, socketId);
  }

  // Event Listeners
  onPollJoined(callback: (data: { name: string }) => void): void {
    this.socket?.on(SOCKET_EVENTS.POLL_JOINED, callback);
  }

  onNewQuestion(callback: (question: QuestionData) => void): void {
    this.socket?.on(SOCKET_EVENTS.POLL_NEW_QUESTION, callback);
  }

  onTimeUpdate(
    callback: (data: { timeLeft: number; serverTimestamp: number }) => void
  ): void {
    this.socket?.on(SOCKET_EVENTS.POLL_TIME_UPDATE, callback);
  }

  onWaitingForQuestion(callback: () => void): void {
    this.socket?.on(SOCKET_EVENTS.POLL_WAITING_FOR_QUESTION, callback);
  }

  onPollComplete(callback: (data: PollResults) => void): void {
    this.socket?.on(SOCKET_EVENTS.POLL_COMPLETE, callback);
  }

  onHistoryResponse(callback: (history: HistoryQuestion[]) => void): void {
    this.socket?.on(SOCKET_EVENTS.STUDENT_HISTORY_RESPONSE, callback);
  }

  onUpdateResults(callback: (results: Record<string, number>) => void): void {
    this.socket?.on(SOCKET_EVENTS.POLL_UPDATE_RESULTS, callback);
  }

  onStudentList(callback: (students: Record<string, null>) => void): void {
    this.socket?.on(SOCKET_EVENTS.POLL_STUDENT_LIST, callback);
  }

  onKicked(callback: () => void): void {
    this.socket?.on(SOCKET_EVENTS.POLL_KICKED, callback);
  }

  offPollJoined(): void {
    this.socket?.off(SOCKET_EVENTS.POLL_JOINED);
  }

  offNewQuestion(): void {
    this.socket?.off(SOCKET_EVENTS.POLL_NEW_QUESTION);
  }

  offTimeUpdate(): void {
    this.socket?.off(SOCKET_EVENTS.POLL_TIME_UPDATE);
  }

  offWaitingForQuestion(): void {
    this.socket?.off(SOCKET_EVENTS.POLL_WAITING_FOR_QUESTION);
  }

  offPollComplete(): void {
    this.socket?.off(SOCKET_EVENTS.POLL_COMPLETE);
  }

  offHistoryResponse(): void {
    this.socket?.off(SOCKET_EVENTS.STUDENT_HISTORY_RESPONSE);
  }

  offUpdateResults(): void {
    this.socket?.off(SOCKET_EVENTS.POLL_UPDATE_RESULTS);
  }

  offStudentList(): void {
    this.socket?.off(SOCKET_EVENTS.POLL_STUDENT_LIST);
  }

  offKicked(): void {
    this.socket?.off(SOCKET_EVENTS.POLL_KICKED);
  }

  removeAllListeners(): void {
    this.offPollJoined();
    this.offNewQuestion();
    this.offTimeUpdate();
    this.offWaitingForQuestion();
    this.offPollComplete();
    this.offHistoryResponse();
    this.offUpdateResults();
    this.offStudentList();
    this.offKicked();
  }
}

// Create singleton instance
export const socketService = new SocketService();
