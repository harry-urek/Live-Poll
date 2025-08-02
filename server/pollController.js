const PollSession = require('./pollModel');
const { stopTimer, getRunningTimers } = require('./utils/timer');


exports.resetPoll = (req, res) => {
    try {

        if (PollSession.timer) {
            stopTimer(PollSession.timer);
        }

        PollSession.reset();

        res.json({
            message: 'Poll reset successfully',
            sessionId: PollSession.metadata.sessionId
        });
    } catch (error) {
        console.error('Error resetting poll:', error);
        res.status(500).json({ error: 'Failed to reset poll' });
    }
};

exports.getPollState = (req, res) => {
    try {
        const stats = PollSession.getStats();
        const resultsWithPercentages = PollSession.getResultsWithPercentages();

        res.json({
            ...stats,
            results: resultsWithPercentages,
            unansweredStudents: PollSession.getUnansweredStudents(),
            allAnswered: PollSession.areAllStudentsAnswered()
        });
    } catch (error) {
        console.error('Error getting poll state:', error);
        res.status(500).json({ error: 'Failed to get poll state' });
    }
};


exports.getStudents = (req, res) => {
    try {
        const students = Object.values(PollSession.students).map(s => ({
            id: s.id,
            name: s.name,
            answered: s.answered,
            joinedAt: s.joinedAt,
            isActive: s.isActive
        }));

        res.json({
            students,
            totalCount: students.length,
            answeredCount: students.filter(s => s.answered).length
        });
    } catch (error) {
        console.error('Error getting students:', error);
        res.status(500).json({ error: 'Failed to get students' });
    }
};

exports.getChatHistory = (req, res) => {
    try {
        res.json({
            chat: PollSession.chat || [],
            messageCount: PollSession.chat?.length || 0
        });
    } catch (error) {
        console.error('Error getting chat history:', error);
        res.status(500).json({ error: 'Failed to get chat history' });
    }
};

exports.getQuestionHistory = (req, res) => {
    try {
        res.json({
            history: PollSession.questionHistory,
            totalQuestions: PollSession.questionHistory.length
        });
    } catch (error) {
        console.error('Error getting question history:', error);
        res.status(500).json({ error: 'Failed to get question history' });
    }
};

exports.getSessionStats = (req, res) => {
    try {
        const stats = PollSession.getStats();
        const runningTimers = getRunningTimers();

        res.json({
            ...stats,
            runningTimers,
            settings: PollSession.settings
        });
    } catch (error) {
        console.error('Error getting session stats:', error);
        res.status(500).json({ error: 'Failed to get session stats' });
    }
};

exports.updateSettings = (req, res) => {
    try {
        const { settings } = req.body;
        PollSession.updateSettings(settings);

        res.json({
            message: 'Settings updated successfully',
            settings: PollSession.settings
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

exports.exportSession = (req, res) => {
    try {
        const exportData = PollSession.exportData();

        res.json({
            message: 'Session data exported successfully',
            data: exportData,
            exportedAt: new Date()
        });
    } catch (error) {
        console.error('Error exporting session:', error);
        res.status(500).json({ error: 'Failed to export session data' });
    }
};

exports.kickStudent = (req, res) => {
    try {
        const { studentId } = req.params;
        const removedStudent = PollSession.removeStudent(studentId);

        if (removedStudent) {
            res.json({
                message: 'Student kicked successfully',
                student: removedStudent
            });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (error) {
        console.error('Error kicking student:', error);
        res.status(500).json({ error: 'Failed to kick student' });
    }
};