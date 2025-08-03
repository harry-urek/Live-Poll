import { useState, useEffect } from 'react';

interface QuestionResultDisplayProps {
    question: {
        text: string;
        options: string[];
        correctAnswer?: number;
    };
    results: Record<string, number>;
    questionNumber?: number;
    showAnimation?: boolean;
}

interface OptionResult {
    option: string;
    count: number;
    percentage: number;
    isCorrect: boolean;
}

function QuestionResultDisplay({ question, results, questionNumber, showAnimation = true }: QuestionResultDisplayProps) {
    const [animate, setAnimate] = useState(false);

    // Calculate percentages and prepare data
    const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0);
    const optionResults: OptionResult[] = question.options.map((option, index) => ({
        option,
        count: results[option] || 0,
        percentage: totalVotes > 0 ? Math.round(((results[option] || 0) / totalVotes) * 100) : 0,
        isCorrect: question.correctAnswer !== undefined && index === question.correctAnswer
    }));

    // Start animation
    useEffect(() => {
        if (showAnimation) {
            const timer = setTimeout(() => setAnimate(true), 200);
            return () => clearTimeout(timer);
        } else {
            setAnimate(true);
        }
    }, [showAnimation]);

    return (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
            {questionNumber && (
                <div className="px-6 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Question {questionNumber}</h3>
                </div>
            )}

            {/* Question Header */}
            <div className="bg-gray-800 text-white px-6 py-4">
                <h4 className="text-base font-medium">{question.text}</h4>
            </div>

            <div className="p-6">
                <div className="space-y-4">
                    {optionResults.map((result) => (
                        <div key={result.option} className="relative">
                            {/* Option Header */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className={`rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-medium mr-3 ${result.isCorrect ? 'bg-green-500' : 'bg-blue-500'
                                        }`}>
                                        {question.options.indexOf(result.option) + 1}
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">
                                        {result.option}
                                        {result.isCorrect && (
                                            <span className="ml-2 text-green-600 text-xs">✓ Correct</span>
                                        )}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-gray-800">
                                    {result.percentage}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${result.isCorrect ? 'bg-green-500' : 'bg-blue-500'
                                        }`}
                                    style={{
                                        width: animate ? `${result.percentage}%` : '0%',
                                        transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    {/* Subtle gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                </div>

                                {/* Vote count */}
                                {result.count > 0 && result.percentage > 15 && (
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-xs font-medium">
                                        {result.count} vote{result.count !== 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-center text-gray-600">
                        <p className="text-sm">
                            Total Responses: <span className="font-medium text-blue-600">{totalVotes}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuestionResultDisplay;