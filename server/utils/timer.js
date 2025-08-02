class Timer {
    constructor() {
        this.timers = new Map();
    }


    startTimer(duration, onComplete, onTick = null) {
        const timerId = `timer_${Date.now()}_${Math.random()}`;
        let timeLeft = duration;

        const interval = setInterval(() => {
            timeLeft--;


            if (onTick && typeof onTick === 'function') {
                onTick(timeLeft);
            }


            if (timeLeft <= 0) {
                clearInterval(interval);
                this.timers.delete(timerId);

                if (onComplete && typeof onComplete === 'function') {
                    onComplete();
                }
            }
        }, 1000);

        // Store timer
        this.timers.set(timerId, {
            interval,
            duration,
            timeLeft,
            startTime: Date.now(),
            onComplete,
            onTick
        });

        console.log(`⏰ Timer started: ${duration} seconds (ID: ${timerId})`);
        return timerId;
    }


    stopTimer(timerId) {
        const timer = this.timers.get(timerId);
        if (timer) {
            clearInterval(timer.interval);
            this.timers.delete(timerId);
            console.log(` Timer stopped: ${timerId}`);
            return true;
        }
        return false;
    }


    getRemainingTime(timerId) {
        const timer = this.timers.get(timerId);
        if (timer) {
            return timer.timeLeft;
        }
        return 0;
    }


    isRunning(timerId) {
        return this.timers.has(timerId);
    }


    getRunningTimers() {
        return Array.from(this.timers.entries()).map(([id, timer]) => ({
            id,
            duration: timer.duration,
            timeLeft: timer.timeLeft,
            startTime: timer.startTime
        }));
    }


    stopAllTimers() {
        for (const [timerId, timer] of this.timers) {
            clearInterval(timer.interval);
        }
        this.timers.clear();
        console.log(' All timers stopped');
    }


    extendTimer(timerId, additionalTime) {
        const timer = this.timers.get(timerId);
        if (timer) {
            timer.timeLeft += additionalTime;
            timer.duration += additionalTime;
            console.log(`⏰ Timer extended: ${timerId} (+${additionalTime}s)`);
            return true;
        }
        return false;
    }
}


const timerInstance = new Timer();


const startTimer = (duration, onComplete, onTick) => {
    return timerInstance.startTimer(duration, onComplete, onTick);
};

const stopTimer = (timerId) => {
    return timerInstance.stopTimer(timerId);
};

const getRemainingTime = (timerId) => {
    return timerInstance.getRemainingTime(timerId);
};

const isTimerRunning = (timerId) => {
    return timerInstance.isRunning(timerId);
};

const stopAllTimers = () => {
    return timerInstance.stopAllTimers();
};

const extendTimer = (timerId, additionalTime) => {
    return timerInstance.extendTimer(timerId, additionalTime);
};

const getRunningTimers = () => {
    return timerInstance.getRunningTimers();
};

module.exports = {
    Timer,
    startTimer,
    stopTimer,
    getRemainingTime,
    isTimerRunning,
    stopAllTimers,
    extendTimer,
    getRunningTimers,
    timerInstance
};