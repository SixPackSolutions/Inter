document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startTimer').addEventListener('click', startWorkout);
    document.getElementById('pauseTimer').addEventListener('click', pauseResumeTimer);
    document.getElementById('resetTimer').addEventListener('click', resetTimer);
});

let currentSet = 1;
let currentRound = 0;
let totalSets = 1;
let isPaused = false;
let timer = null;
let workoutRounds = [];

function addRound() {
    const roundsContainer = document.getElementById('roundsContainer');
    const roundDiv = document.createElement('div');
    roundDiv.classList.add('round');
    roundDiv.innerHTML = `
        <input type="number" placeholder="Work Duration (sec)" class="workDuration">
        <input type="number" placeholder="Rest Duration (sec)" class="restDuration">
    `;
    roundsContainer.appendChild(roundDiv);
}

function startWorkout() {
    workoutRounds = [];
    totalSets = parseInt(document.getElementById('numSets').value) || 1;
    currentSet = 1;
    currentRound = 0;

    document.querySelectorAll('.round').forEach(roundDiv => {
        const workDuration = roundDiv.querySelector('.workDuration').value;
        const restDuration = roundDiv.querySelector('.restDuration').value;
        workoutRounds.push({workDuration: parseInt(workDuration, 10), restDuration: parseInt(restDuration, 10)});
    });

    if (workoutRounds.length > 0) {
        startNextRound();
    }
}

function startNextRound() {
    if (currentRound < workoutRounds.length) {
        runTimer('Work', workoutRounds[currentRound].workDuration, function() {
            runTimer('Rest', workoutRounds[currentRound].restDuration, function() {
                currentRound++;
                startNextRound();
            });
        });
    } else if (currentSet < totalSets) {
        currentRound = 0;
        currentSet++;
        startNextRound();
    } else {
        alert('Workout Complete!');
        resetTimer();
    }
}

function runTimer(phase, duration, callback) {
    let time = duration;
    updateTimerDisplay(time);
    timer = setInterval(function() {
        if (!isPaused) {
            time--;
            updateTimerDisplay(time);
            if (time <= 0) {
                clearInterval(timer);
                callback();
            }
        }
    }, 1000);
}

function pauseResumeTimer() {
    if (isPaused) {
        isPaused = false;
        this.textContent = 'Pause';
    } else {
        isPaused = true;
        this.textContent = 'Resume';
    }
}

function resetTimer() {
    clearInterval(timer);
    isPaused = false;
    document.getElementById('pauseTimer').textContent = 'Pause';
    document.getElementById('timerDisplay').textContent = '00:00';
    document.getElementById('pauseTimer').disabled = true;
    document.getElementById('resetTimer').disabled = true;
}

function updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById('timerDisplay').textContent = `${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

// Initial setup: Add the first round by default and enable buttons
addRound();
document.getElementById('pauseTimer').disabled = false;
document.getElementById('resetTimer').disabled = false;
