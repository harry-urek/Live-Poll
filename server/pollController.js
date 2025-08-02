const PollSession = require('../models/pollSession');

// Reset everything
exports.resetPoll = (req, res) => {
    PollSession.currentQuestion = null;
    PollSession.questions = [];
    PollSession.results = {};
    PollSession.timer = null;
    for (let sid in PollSession.students) {
        PollSession.students[sid].answered = false;
    }
    res.json({ message: 'Poll reset successfully' });
};

// Get current poll state
exports.getPollState = (req, res) => {
    res.json({
        currentQuestion: PollSession.currentQuestion,
        results: PollSession.results,
        studentCount: Object.keys(PollSession.students).length,
    });
};

// Get list of students
exports.getStudents = (req, res) => {
    const students = Object.values(PollSession.students).map(s => s.name);
    res.json({ students });
};

// Optional: Chat history
exports.getChatHistory = (req, res) => {
    res.json({ chat: PollSession.chat || [] });
};
