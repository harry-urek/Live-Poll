import { useAppState, useStudentSocket } from '../hooks';
import { USER_ROLES } from '../constants';

function Home() {
    const { handleRoleSelect } = useAppState();
    const { isConnected } = useStudentSocket();
    return (
        <div className="flex justify-center items-center h-screen flex-col bg-blue-100">
            <div className="mb-8 pb-8">
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                    onClick={() => handleRoleSelect(USER_ROLES.STUDENT)}
                >
                    🎯 Interview Poll
                </button>
            </div>
            <div className="mt-4">
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 min-w-[120px]"
                    disabled={!isConnected}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default Home;