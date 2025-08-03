import { useState, useEffect, useCallback } from 'react';
import type { QuestionData, PollResults } from '../types';
import { UI_MESSAGES, APP_CONFIG } from '../constants';
import { formatTimeRemaining } from '../utils';
import Results from './Results';

interface QuestionProps {
    questionData: QuestionData;
    serverTimeLeft: number;
    pollResults: PollResults | null;
    onSubmitAnswer: (answer: string) => void;
    onResultsComplete: () => void;
}

function Question({ questionData, serverTimeLeft, pollResults: initialPollResults, onSubmitAnswer, onResultsComplete }: QuestionProps) {
    const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [pollResults, setPollResults] = useState<PollResults | null>(initialPollResults);

    // Update question when questionData prop changes
    useEffect(() => {
        if (questionData) {
            console.log('Question component: Received question data via props:', questionData);
            setCurrentQuestion(questionData);
            setSelectedOption(null);
            setIsSubmitted(false);
            setTimeLeft(questionData.timeLimit || APP_CONFIG.defaultTimeLimit);
            setShowResults(false);
        }
    }, [questionData]);

    // Update poll results when prop changes
    useEffect(() => {
        if (initialPollResults) {
            setPollResults(initialPollResults);
            setShowResults(true);
        }
    }, [initialPollResults]);

    // Update time from server instead of local countdown
    useEffect(() => {
        setTimeLeft(serverTimeLeft);
    }, [serverTimeLeft]);

    const handleSubmitAnswer = useCallback(() => {
        if (selectedOption === null || isSubmitted || !currentQuestion) return;

        const answer = currentQuestion.options[selectedOption];
        onSubmitAnswer(answer);
        setIsSubmitted(true);
    }, [selectedOption, isSubmitted, currentQuestion, onSubmitAnswer]);

    // Auto-submit when time runs out (server-controlled)
    useEffect(() => {
        if (timeLeft <= 0 && selectedOption !== null && !isSubmitted && currentQuestion) {
            console.log('Auto-submitting answer due to server timeout');
            handleSubmitAnswer();
        }
    }, [timeLeft, selectedOption, isSubmitted, currentQuestion, handleSubmitAnswer]);

    const handleOptionSelect = (index: number) => {
        if (isSubmitted || timeLeft <= 0) return;
        setSelectedOption(index);
    };

    // Show results if available
    if (showResults && pollResults) {
        return (
            <Results
                results={pollResults.results}
                question={pollResults.question}
                onComplete={onResultsComplete}
            />
        );
    }

    if (!currentQuestion) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 px-6">
                <div className="w-full max-w-2xl text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Question Component</h1>
                    <p className="text-gray-600">{UI_MESSAGES.LOADING}</p>
                </div>
            </div>
        );
    }

    const timeDisplay = formatTimeRemaining(timeLeft);

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 px-6">
                <div className="w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Question</h1>
                        <div className="flex items-center text-red-600 text-lg font-medium">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {timeDisplay}
                        </div>
                    </div>

                    <div className="bg-white shadow-xl rounded-lg mb-8">
                        {/* Question Header */}
                        <div className="bg-gray-800 text-white rounded-t-lg py-6 px-6">
                            <h2 className="text-lg font-medium">{currentQuestion.text}</h2>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleOptionSelect(index)}
                                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedOption === index
                                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                                            } ${isSubmitted || timeLeft <= 0 ? 'cursor-not-allowed opacity-70' : ''}`}
                                    >
                                        {/* Option Number Badge */}
                                        <div className={`rounded-full w-8 h-8 flex items-center justify-center text-white font-medium mr-4 ${selectedOption === index ? 'bg-purple-500' : 'bg-gray-500'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        {/* Option Text */}
                                        <span className="text-lg text-gray-800 font-medium">
                                            {option}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Submit Button */}
                            {selectedOption !== null && !isSubmitted && timeLeft > 0 && (
                                <div className="mt-6 flex justify-center">
                                    <button
                                        onClick={handleSubmitAnswer}
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                                    >
                                        Submit Answer
                                    </button>
                                </div>
                            )}

                            {/* Submitted State */}
                            {isSubmitted && !showResults && (
                                <div className="mt-6 flex justify-center">
                                    <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg text-lg font-medium">
                                        {UI_MESSAGES.SUBMITTED}
                                    </div>
                                </div>
                            )}

                            {/* Time Up State */}
                            {timeLeft <= 0 && !isSubmitted && !showResults && (
                                <div className="mt-6 flex justify-center">
                                    <div className="bg-red-100 text-red-800 px-6 py-3 rounded-lg text-lg font-medium">
                                        {UI_MESSAGES.TIME_UP}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Question;