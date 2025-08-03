
import type { WelcomeProps } from '../types';


function Welcome({ onRoleSelect }: WelcomeProps) {
    return (
        <div className="flex justify-center items-center flex-col min-h-screen bg-blue-100">
            <div className="text-center mb-12 max-w-2xl p-2">
                <h1 className="text-4xl font-normal mb-4 text-gray-900">
                    Welcome to the <span className="font-semibold">Live Polling System</span>
                </h1>
                <p className="text-lg font-normal text-gray-600 text-wrap">
                    Please select the role that best describes you to begin using the live polling system
                </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 m-10 w-full max-w-4xl">
                <div
                    onClick={() => onRoleSelect('student')}
                    className="flex-1 border-2 border-purple-300 rounded-lg p-10 hover:border-purple-500 cursor-pointer transition-colors duration-200 bg-white hover:bg-purple-50"
                >
                    <h2 className="text-xl font-semibold mb-3 text-gray-900">I'm a Student</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Join a live poll session and submit your answers in real-time
                    </p>
                </div>
                <div
                    onClick={() => onRoleSelect('teacher')}
                    className="flex-1 border-2 border-purple-300 rounded-lg p-10 hover:border-purple-500 cursor-pointer transition-colors duration-200 bg-white hover:bg-purple-50"
                >
                    <h2 className="text-xl font-semibold mb-3 text-gray-900">I'm a Teacher</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Create questions and manage live poll sessions with your students
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Welcome;