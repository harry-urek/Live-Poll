function Question() {
    function handleOptionSelect(index: any): void {
        throw new Error("Function not implemented.")
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 px-6 ">
            <div className="  w-full max-w-2xl">
                <div className="flex justify-between items-center mb-8" >
                    <h1>Question</h1>
                    <div className="flex items-center text-error text-lg font-medium">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>00:00
                        {/* 00:{timeLeft.toString().padStart(2, '0')} */}
                    </div>
                </div>
                <div className="card bg-base-100 shadow-xl mb-8">
                    {/* Question Header */}
                    <div className="card-body bg-neutral text-neutral-content rounded-t-2xl py-6">
                        <h2 className="card-title text-lg font-medium">currentQuestion    ...text... </h2>
                    </div>
                    <div className="card-body pt-6 pb-8">
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleOptionSelect(index)}
                                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedOption === index
                                        ? 'border-primary bg-primary/10 shadow-lg'
                                        : 'border-base-300 bg-base-50 hover:border-base-400'
                                        } ${isSubmitted ? 'cursor-not-allowed opacity-70' : ''}`}
                                >
                                    {/* Option Number Badge */}
                                    <div className={`badge text-white font-medium mr-4 w-6 h-6 ${selectedOption === index ? 'badge-primary' : 'badge-neutral'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    {/* Option Text */}
                                    <span className="text-lg text-base-content font-medium">
                                        {option}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Question