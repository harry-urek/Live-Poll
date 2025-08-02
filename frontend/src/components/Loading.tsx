function Loading() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-100">
            <div className="flex items-center justify-center w-full h-60 gap-6 flex-col bg-white rounded-lg shadow-lg p-8 max-w-md">
                <span className="loading loading-spinner loading-lg text-purple-600"></span>
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2 text-gray-900">
                        Wait for the teacher to ask questions..
                    </h1>
                    <p className="text-gray-600">
                        You're successfully connected. The teacher will start the poll shortly.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Loading;