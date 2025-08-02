import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

function AddQuestion() {
    const [question, setQuestion] = useState('');
    const [timeLimit, setTimeLimit] = useState(60);
    const [options, setOptions] = useState([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
    ]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize socket connection for teacher
    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Teacher socket connected:', newSocket.id);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Teacher socket connection error:', error);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, { text: '', isCorrect: false }]);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, text: string) => {
        const newOptions = [...options];
        newOptions[index].text = text;
        setOptions(newOptions);
    };

    const setCorrectAnswer = (index: number, isCorrect: boolean) => {
        const newOptions = options.map((option, i) => ({
            ...option,
            isCorrect: i === index ? isCorrect : false
        }));
        setOptions(newOptions);
    };

    const handleSubmit = () => {
        if (!socket || !question.trim() || options.every(opt => !opt.text.trim()) || isSubmitting) {
            console.log('Cannot submit - missing socket, question, options, or already submitting');
            return;
        }

        setIsSubmitting(true);
        console.log('Teacher asking question - first showing waiting message');

        // First, show waiting message to students
        socket.emit('teacher:showWaiting');

        // Add a small delay, then ask the question
        setTimeout(() => {
            const questionData = {
                text: question,
                options: options.filter(opt => opt.text.trim()).map(opt => opt.text),
                correctAnswer: options.findIndex(opt => opt.isCorrect),
                timeLimit: timeLimit
            };

            console.log('Now sending question:', questionData);
            socket.emit('teacher:askQuestion', questionData);

            // Reset form after successful submission
            setTimeout(() => {
                setIsSubmitting(false);
                setQuestion('');
                setOptions([
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false }
                ]);
            }, 2000);
        }, 1000); // 1 second delay to show waiting state
    };

    return (
        <div className="min-h-screen bg-purple-100 p-8 pl-16">
            {/* Header with Intervue Poll badge */}
            <div className="mb-8">

                {/* Blue header box */}
                <div className="border-2 border-blue-400 rounded-lg p-6 bg-white max-w-xl">
                    <h1 className="text-4xl font-normal mb-3 text-gray-800">
                        Let's <span className="font-bold">Get Started</span>
                    </h1>
                    <p className="text-gray-400 leading-relaxed">
                        you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
                    </p>
                </div>
            </div>

            {/* Question Input Section */}
            <div className="mb-8 max-w-3xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Enter your question</h3>
                    <div className="flex items-center gap-2">
                        <select
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                            className="bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-800"
                        >
                            <option value={30}>30 seconds</option>
                            <option value={60}>60 seconds</option>
                            <option value={90}>90 seconds</option>
                            <option value={120}>120 seconds</option>
                        </select>
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <div className="bg-gray-200 rounded-lg p-6">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question here..."
                        className="w-full h-24 bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-400 text-lg"
                    />
                    <div className="flex justify-end text-sm text-gray-400 mt-2">
                        {question.length}/100
                    </div>
                </div>
            </div>

            {/* Options Section */}
            <div className="mb-8 max-w-3xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-800">Edit Options</h3>
                    <h3 className="text-lg font-medium text-gray-800">Is it Correct?</h3>
                </div>

                <div className="space-y-4">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-6 p-4 bg-gray-200 rounded-lg">
                            <div className="flex items-center gap-3 flex-1">
                                <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                </span>
                                <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    placeholder="Enter option text"
                                    className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`option-${index}`}
                                        checked={option.isCorrect}
                                        onChange={() => setCorrectAnswer(index, true)}
                                        className="w-4 h-4 text-purple-500 accent-purple-500"
                                    />
                                    <span className="text-sm text-gray-800">Yes</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`option-${index}`}
                                        checked={!option.isCorrect}
                                        onChange={() => setCorrectAnswer(index, false)}
                                        className="w-4 h-4 text-gray-400 accent-gray-400"
                                    />
                                    <span className="text-sm text-gray-800">No</span>
                                </label>

                                {options.length > 2 && (
                                    <button
                                        onClick={() => removeOption(index)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add More Option Button */}
                {options.length < 6 && (
                    <div className="mt-6">
                        <button
                            onClick={addOption}
                            className="text-purple-500 border-2 border-dashed border-purple-500 rounded-lg px-6 py-3 hover:bg-purple-500 hover:text-white transition-colors"
                        >
                            + Add More option
                        </button>
                    </div>
                )}
            </div>

            {/* Fixed Submit Button */}
            <div className="fixed bottom-8 right-8">
                <button
                    onClick={handleSubmit}
                    disabled={!question.trim() || options.every(opt => !opt.text.trim()) || isSubmitting}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg text-lg font-medium shadow-lg transition-colors"
                >
                    {isSubmitting ? 'Asking...' : 'Ask Question'}
                </button>
            </div>
        </div>
    );
}

export default AddQuestion;