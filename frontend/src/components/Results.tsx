import { useState, useEffect } from 'react';

interface ResultsProps {
    results: Record<string, number>;
    question: {
        text: string;
        options: string[];
        correctAnswer?: number;
    };
    onComplete: () => void;
}

interface OptionResult {
    option: string;
    count: number;
    percentage: number;
    isCorrect: boolean;
}

function Results({ results, question, onComplete }: ResultsProps) {
    const [showAnimation, setShowAnimation] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10);

    // Calculate percentages and prepare data
    const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);
    const optionResults: OptionResult[] = question.options.map((option, index) => ({
        option,
        count: results[option] || 0,
        percentage: totalVotes > 0 ? Math.round(((results[option] || 0) / totalVotes) * 100) : 0,
        isCorrect: question.correctAnswer !== undefined && index === question.correctAnswer
    }));

    // Sort by percentage (highest first)
    optionResults.sort((a, b) => b.percentage - a.percentage);

    // Start animation and countdown
    useEffect(() => {
        // Trigger animation after component mounts
        const animationTimer = setTimeout(() => {
            setShowAnimation(true);
        }, 300);

        // Start countdown timer
        const countdownInterval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearTimeout(animationTimer);
            clearInterval(countdownInterval);
        };
    }, [onComplete]);

    // Get color based on ranking
    const getBarColor = (index: number, isCorrect: boolean) => {
        if (isCorrect) return 'bg-green-500';
        if (index === 0) return 'bg-purple-500'; // Highest percentage
        if (index === 1) return 'bg-blue-500';   // Second highest
        if (index === 2) return 'bg-orange-500'; // Third highest
        return 'bg-gray-500'; // Others
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 px-6">
            <div className="w-full max-w-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Question Results</h1>
                    <div className="flex items-center text-blue-600 text-lg font-medium">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        00:{timeLeft.toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="bg-white shadow-xl rounded-lg mb-8">
                    {/* Question Header */}
                    <div className="bg-gray-800 text-white rounded-t-lg py-6 px-6">
                        <h2 className="text-lg font-medium">{question.text}</h2>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {optionResults.map((result, index) => (
                                <div
                                    key={result.option}
                                    className="relative"
                                >
                                    {/* Option Container */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className={`rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-medium mr-3 ${result.isCorrect ? 'bg-green-500' : 'bg-gray-500'
                                                }`}>
                                                {question.options.indexOf(result.option) + 1}
                                            </div>
                                            <span className="text-lg text-gray-800 font-medium">
                                                {result.option}
                                                {result.isCorrect && (
                                                    <span className="ml-2 text-green-600 text-sm">✓ Correct</span>
                                                )}
                                            </span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-800">
                                            {result.percentage}%
                                        </span>
                                    </div>

                                    {/* Animated Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(index, result.isCorrect)}`}
                                            style={{
                                                width: showAnimation ? `${result.percentage}%` : '0%',
                                                transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                                        </div>

                                        {/* Vote count overlay */}
                                        {result.count > 0 && (
                                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium">
                                                {result.count} vote{result.count !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="text-center text-gray-600">
                                <p className="text-lg font-medium">
                                    Total Responses: <span className="text-purple-600">{totalVotes}</span>
                                </p>
                                {question.correctAnswer !== undefined && (
                                    <p className="text-sm mt-2">
                                        Correct Answer: <span className="text-green-600 font-medium">
                                            {question.options[question.correctAnswer]}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Loading next question indicator */}
                        <div className="mt-6 flex justify-center">
                            <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg text-lg font-medium flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 mr-2"></div>
                                Loading next question in {timeLeft}s...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Results;