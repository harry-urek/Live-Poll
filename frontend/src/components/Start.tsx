function Intro() {
    return (
        <div className="flex flex-col justify-around items-center w-full">

            <div className="text-center mb-12 max-w-2xl p-2" >

                <h1 className="text-4xl font-normal mb-4 text-gray-900 p-3">Let’s <span className="font-semibold">Get Started</span></h1>
                <p className="text-lg font-normal text-gray-600 text-wrap"> If you’re  a student, you’ll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates</p>
            </div>
            <div>


                <form className="space-y-4 w-full max-w-2xl px-4 ">
                    <label className="block mb-3 text-lg font-medium text-gray-900">Enter Your Name</label>
                    <input className="w-full px-10 py-4 text-lg bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-500" placeholder="Your Name" />
                </form>

            </div>

        </div>
    )
}
export default Intro