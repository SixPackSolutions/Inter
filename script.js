let timer;
let isWorkout = true;
let secondsLeft;
let workoutDuration = 0;
let restDuration = 0;

document.getElementById('startTimer').addEventListener('click', function() {
    workoutDuration = parseInt(document.getElementById('workDuration').value) || 0;
    restDuration = parseInt(document.getElementById('restDuration').value) || 0;
    if (workoutDuration <= 0 || restDuration <= 0) {
        alert("Please enter valid durations for both workout and rest intervals.");
        return;
    }
    secondsLeft = workoutDuration;
    document.getElementById('pauseTimer').disabled = false;
    document.getElementById('resetTimer').disabled = false;
    this.disabled = true;
    startInterval();
});

document.getElementById('pauseTimer').addEventListener('click', function() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        this.textContent = "Resume";
    } else {
        this.textContent = "Pause";
        startInterval();
    }
});

document.getElementById('resetTimer').addEventListener('click', function() {
    clearInterval(timer);
    timer = null;
    isWorkout = true;
    secondsLeft = workoutDuration;
    document.getElementById('startTimer').disabled = false;
    document.getElementById('pauseTimer').disabled = true;
    document.getElementById('resetTimer').disabled = true;
    document.getElementById('pauseTimer').textContent = "Pause";
    document.getElementById('timerDisplay').textContent = "00:00";
});

function startInterval() {
    timer = setInterval(function() {
        secondsLeft--;
        let minutes = Math.floor(secondsLeft / 60);
        let seconds = secondsLeft % 60;
        document.getElementById('timerDisplay').textContent = `${pad(minutes)}:${pad(seconds)}`;
        if (secondsLeft <= 0) {
            isWorkout = !isWorkout;
            secondsLeft = isWorkout ? workoutDuration : restDuration;
            alert(isWorkout ? "Workout time!" : "Rest time!");
        }
    }, 1000);
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}
