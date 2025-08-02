import { useState } from 'react';

interface StartProps {
    onStudentJoin: (name: string) => void;
}

function Start({ onStudentJoin }: StartProps) {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onStudentJoin(name.trim());
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen bg-blue-100 px-6">
            <div className="text-center mb-12 max-w-2xl p-2">
                <h1 className="text-4xl font-normal mb-4 text-gray-900 p-3">
                    Let's <span className="font-semibold">Get Started</span>
                </h1>
                <p className="text-lg font-normal text-gray-600 text-wrap">
                    If you're a student, you'll be able to submit your answers, participate in live polls,
                    and see how your responses compare with your classmates
                </p>
            </div>

            <div className="w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6 px-4">
                    <div>
                        <label className="block mb-3 text-lg font-medium text-gray-900">
                            Enter Your Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-10 py-4 text-lg text-gray-800 text-base-300 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 min-w-[120px]"
                        >
                            Join Poll
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Start;