import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import QuestionResultDisplay from './QuestionResultDisplay';

interface PollHistoryDrawerProps {
    socket: Socket | null;
    isOpen: boolean;
    onClose: () => void;
}

interface HistoryQuestion {
    text: string;
    options: string[];
    correctAnswer?: number;
    results: Record<string, number>;
    completedAt: Date;
}

function PollHistoryDrawer({ socket, isOpen, onClose }: PollHistoryDrawerProps) {
    const [questionHistory, setQuestionHistory] = useState<HistoryQuestion[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch question history when drawer opens
    useEffect(() => {
        if (isOpen && socket) {
            setLoading(true);
            // Request question history from server
            socket.emit('student:getHistory');

            // Listen for history response
            const handleHistory = (history: HistoryQuestion[]) => {
                setQuestionHistory(history);
                setLoading(false);
            };

            socket.on('student:historyResponse', handleHistory);

            return () => {
                socket.off('student:historyResponse', handleHistory);
            };
        }
    }, [isOpen, socket]);

    // Don't show mock data - let it show the empty state message
    useEffect(() => {
        if (isOpen && questionHistory.length === 0 && !loading) {
            setLoading(false);
        }
    }, [isOpen, questionHistory.length, loading]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            ></div>

            {/* Drawer Panel */}
            <div className={`fixed top-0 right-0 h-full w-1/2 bg-gray-50 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">View Poll History</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex flex-col justify-center items-center h-64">
                                <div className="loading loading-spinner loading-lg text-purple-600 mb-4"></div>
                                <span className="text-gray-600">Loading poll history...</span>
                            </div>
                        ) : questionHistory.length === 0 ? (
                            <div className="text-center py-16">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Poll History</h3>
                                <p className="text-gray-600">No completed polls to display yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {questionHistory.map((question, index) => (
                                    <QuestionResultDisplay
                                        key={index}
                                        question={question}
                                        results={question.results}
                                        questionNumber={index + 1}
                                        showAnimation={false}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-white border-t border-gray-200 p-6">
                        <div className="text-center text-sm text-gray-500">
                            {questionHistory.length > 0 && (
                                <p>Showing {questionHistory.length} completed poll{questionHistory.length !== 1 ? 's' : ''}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PollHistoryDrawer;