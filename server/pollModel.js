const { EventEmitter } = require('events');

class PollSessionModel extends EventEmitter {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        this.currentQuestion = null;
        this.questions = [];
        this.questionHistory = [];
        this.results = {};
        this.students = {};
        this.timer = null;
        this.timeLimit = 60;
        this.showResults = false;
        this.isActive = false;
        this.chat = [];
        this.settings = {
            allowLateSubmissions: false,
            showLiveResults: true,
            autoNextQuestion: false,
            maxStudents: 100
        };
        this.metadata = {
            sessionId: this.generateSessionId(),
            createdAt: new Date(),
            lastActivity: new Date()
        };

        console.log('🔄 Poll session reset');
        this.emit('session:reset');
    }

    generateSessionId() {
        return `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    addQuestion(question) {
        const questionWithId = {
            id: `q_${Date.now()}_${this.questions.length}`,
            ...question,
            createdAt: new Date()
        };

        this.questions.push(questionWithId);
        this.updateLastActivity();

        console.log(`📝 Question added: ${questionWithId.text}`);
        this.emit('question:added', questionWithId);

        return questionWithId;
    }


    setCurrentQuestion(question) {
        this.currentQuestion = question;
        this.results = {};
        this.showResults = false;
        this.isActive = true;

        // Reset all students' answered status
        for (let studentId in this.students) {
            this.students[studentId].answered = false;
            this.students[studentId].answer = null;
            this.students[studentId].answeredAt = null;
        }

        this.updateLastActivity();
        console.log(`🎯 Current question set: ${question.text}`);
        this.emit('question:started', question);
    }


    addStudent(socketId, studentData) {
        if (Object.keys(this.students).length >= this.settings.maxStudents) {
            throw new Error('Maximum number of students reached');
        }

        this.students[socketId] = {
            id: socketId,
            name: studentData.name,
            answered: false,
            answer: null,
            answeredAt: null,
            joinedAt: new Date(),
            isActive: true,
            ...studentData
        };

        this.updateLastActivity();
        console.log(`👨‍🎓 Student added: ${studentData.name} (${socketId})`);
        this.emit('student:joined', { socketId, student: this.students[socketId] });

        return this.students[socketId];
    }


    removeStudent(socketId) {
        const student = this.students[socketId];
        if (student) {
            delete this.students[socketId];
            this.updateLastActivity();
            console.log(`❌ Student removed: ${student.name} (${socketId})`);
            this.emit('student:left', { socketId, student });
            return student;
        }
        return null;
    }

    submitAnswer(socketId, answer) {
        const student = this.students[socketId];

        if (!student) {
            throw new Error('Student not found');
        }

        if (!this.currentQuestion) {
            throw new Error('No active question');
        }

        if (student.answered && !this.settings.allowLateSubmissions) {
            throw new Error('Student has already answered');
        }


        student.answered = true;
        student.answer = answer;
        student.answeredAt = new Date();


        this.results[answer] = (this.results[answer] || 0) + 1;

        this.updateLastActivity();
        console.log(`✅ Answer submitted: ${student.name} -> ${answer}`);
        this.emit('answer:submitted', { socketId, student, answer });

        return this.results;
    }

    completeQuestion() {
        if (!this.currentQuestion) {
            return null;
        }

        const completedQuestion = {
            ...this.currentQuestion,
            results: { ...this.results },
            completedAt: new Date(),
            totalStudents: Object.keys(this.students).length,
            totalAnswered: Object.values(this.students).filter(s => s.answered).length
        };


        this.questionHistory.push(completedQuestion);


        this.showResults = true;
        this.isActive = false;

        this.updateLastActivity();
        console.log(`📊 Question completed: ${this.currentQuestion.text}`);
        this.emit('question:completed', completedQuestion);

        return completedQuestion;
    }


    getStats() {
        const totalStudents = Object.keys(this.students).length;
        const activeStudents = Object.values(this.students).filter(s => s.isActive).length;
        const answeredCount = Object.values(this.students).filter(s => s.answered).length;

        return {
            sessionId: this.metadata.sessionId,
            totalStudents,
            activeStudents,
            answeredCount,
            totalQuestions: this.questions.length,
            completedQuestions: this.questionHistory.length,
            currentQuestion: this.currentQuestion,
            isActive: this.isActive,
            showResults: this.showResults,
            lastActivity: this.metadata.lastActivity,
            createdAt: this.metadata.createdAt
        };
    }


    getResultsWithPercentages() {
        const totalVotes = Object.values(this.results).reduce((sum, count) => sum + count, 0);
        const resultsWithPercentages = {};

        for (const [answer, count] of Object.entries(this.results)) {
            resultsWithPercentages[answer] = {
                count,
                percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
            };
        }

        return {
            results: resultsWithPercentages,
            totalVotes,
            totalStudents: Object.keys(this.students).length
        };
    }


    areAllStudentsAnswered() {
        const activeStudents = Object.values(this.students).filter(s => s.isActive);
        if (activeStudents.length === 0) return false;

        return activeStudents.every(student => student.answered);
    }


    getUnansweredStudents() {
        return Object.values(this.students)
            .filter(student => student.isActive && !student.answered)
            .map(student => ({
                id: student.id,
                name: student.name,
                joinedAt: student.joinedAt
            }));
    }


    addChatMessage(socketId, message) {
        const student = this.students[socketId];
        if (!student) {
            throw new Error('Student not found');
        }

        const chatEntry = {
            id: `msg_${Date.now()}_${Math.random()}`,
            studentId: socketId,
            studentName: student.name,
            message,
            timestamp: new Date()
        };

        this.chat.push(chatEntry);
        this.updateLastActivity();

        // Keep only last 100 messages
        if (this.chat.length > 100) {
            this.chat = this.chat.slice(-100);
        }

        this.emit('chat:message', chatEntry);
        return chatEntry;
    }

    // Update last activity timestamp
    updateLastActivity() {
        this.metadata.lastActivity = new Date();
    }

    // Update session settings
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.emit('settings:updated', this.settings);
    }

    exportData() {
        return {
            metadata: this.metadata,
            settings: this.settings,
            questions: this.questions,
            questionHistory: this.questionHistory,
            students: Object.values(this.students).map(s => ({
                name: s.name,
                joinedAt: s.joinedAt,
                totalAnswered: this.questionHistory.filter(q =>
                    Object.values(this.students).find(st => st.id === s.id)?.answered
                ).length
            })),
            chat: this.chat,
            stats: this.getStats()
        };
    }
}

// Create singleton instance
const PollSession = new PollSessionModel();

// Export both the class and the singleton instance
module.exports = PollSession;
module.exports.PollSessionModel = PollSessionModel;