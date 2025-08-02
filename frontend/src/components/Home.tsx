
// import Welcome from "./welcome"

// import Load from "./Loading"
// import Intro from "./start"

function Home() {
    return (
        // make flex box being in the center and having flex direction - 
        // 
        <div className="flex justify-center items-center h-screen flex-col bg-blue-100">
            {/* make a box button in the center */}
            <div className="mb-8 pb-8 ">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200">🎯 Interview Poll</button>
            </div>

            {/* <Intro /> */}
            {/* <Load /> */}
            <div className="mt-4">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 min-w-[120px]">
                    Continue
                </button>
            </div>

        </div>
    )
}

export default Home