const PollSession = require('./pollModel');
const { startTimer, stopTimer } = require('../utils/timer');

function registerPollSocket(io, socket) {

    socket.on('student:join', ({ name }) => {
        PollSession.students[socket.id] = { name, answered: false };
        socket.emit('poll:joined', { name });

        // Send current question
        if (PollSession.currentQuestion) {
            socket.emit('poll:newQuestion', PollSession.currentQuestion);
        }

        // Send  results
        if (PollSession.showResults) {
            socket.emit('poll:showResults', PollSession.results);
        }

        console.log(`👨‍🎓 Student joined: ${name}`);
        io.emit('poll:studentList', PollSession.students);
    });


    socket.on('teacher:askQuestion', (question) => {
        // Reset  new question
        PollSession.currentQuestion = question;
        PollSession.results = {};
        PollSession.showResults = false;
        PollSession.questionHistory = PollSession.questionHistory || [];

        // Reset all 
        for (let sid in PollSession.students) {
            PollSession.students[sid].answered = false;
        }

        PollSession.timeLimit = question.timeLimit || 60;


        io.emit('poll:newQuestion', question);
        console.log(`📝 New question: ${question.text}`);


        if (PollSession.timer) {
            stopTimer(PollSession.timer);
        }

        PollSession.timer = startTimer(PollSession.timeLimit, () => {

            handleQuestionComplete();
        });
    });

    socket.on('student:submitAnswer', (answer) => {
        const student = PollSession.students[socket.id];
        if (!student || student.answered || !PollSession.currentQuestion) return;

        student.answered = true;
        PollSession.results[answer] = (PollSession.results[answer] || 0) + 1;

        // live update
        io.emit('poll:updateResults', PollSession.results);
        io.emit('poll:studentList', PollSession.students);

        // Check stud
        const allAnswered = Object.values(PollSession.students).every(s => s.answered);

        if (allAnswered) {
            console.log('✅ All students answered');
            handleQuestionComplete();
        }
    });

    // Teacher requests next 
    socket.on('teacher:nextQuestion', () => {
        // Clear current question and show loading to students
        PollSession.currentQuestion = null;
        PollSession.showResults = false;
        io.emit('poll:waitingForQuestion');
        console.log('⏳ Students waiting for next question');
    });

    //  views results
    socket.on('teacher:viewResults', () => {
        if (PollSession.results && Object.keys(PollSession.results).length > 0) {
            socket.emit('teacher:pollResults', {
                question: PollSession.questionHistory[PollSession.questionHistory.length - 1],
                results: PollSession.results,
                studentCount: Object.keys(PollSession.students).length,
                answeredCount: Object.values(PollSession.students).filter(s => s.answered).length
            });
        }
    });

    // Teacher kicks 
    socket.on('teacher:kickStudent', (socketId) => {
        const student = PollSession.students[socketId];
        if (student) {
            console.log(`🚫 Kicked student: ${student.name}`);
            delete PollSession.students[socketId];
            io.to(socketId).emit('poll:kicked');
            io.emit('poll:studentList', PollSession.students);
        }
    });

    // Chat functionality
    socket.on('chat:send', ({ name, message }) => {
        const entry = { name, message, timestamp: Date.now() };
        PollSession.chat = PollSession.chat || [];
        PollSession.chat.push(entry);
        io.emit('chat:message', entry);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const student = PollSession.students[socket.id];
        if (student) {
            console.log(`❌ Disconnected: ${student.name}`);
            delete PollSession.students[socket.id];
            io.emit('poll:studentList', PollSession.students);

            // Check if all remaining students answered
            if (PollSession.currentQuestion && Object.keys(PollSession.students).length > 0) {
                const allAnswered = Object.values(PollSession.students).every(s => s.answered);
                if (allAnswered) {
                    handleQuestionComplete();
                }
            }
        }
    });


    function handleQuestionComplete() {
        if (PollSession.timer) {
            stopTimer(PollSession.timer);
            PollSession.timer = null;
        }


        if (PollSession.currentQuestion) {
            PollSession.questionHistory = PollSession.questionHistory || [];
            PollSession.questionHistory.push({
                ...PollSession.currentQuestion,
                results: { ...PollSession.results },
                completedAt: new Date()
            });
        }

        PollSession.showResults = true;

        // Send  results to students
        io.emit('poll:complete', {
            results: PollSession.results,
            question: PollSession.currentQuestion
        });

        // Send results to teacher 
        io.emit('teacher:pollResults', {
            question: PollSession.currentQuestion,
            results: PollSession.results,
            studentCount: Object.keys(PollSession.students).length,
            answeredCount: Object.values(PollSession.students).filter(s => s.answered).length
        });

        console.log('📊 Question completed, results sent');

        // Clear (students will see loading)
        setTimeout(() => {
            PollSession.currentQuestion = null;
            io.emit('poll:waitingForQuestion');
        }, 3000);
    }
}

module.exports = registerPollSocket;