let currentSet = 1;
let currentRound = 0;
let totalSets = 1;
let isPaused = false;
let timer = null;
let workoutRounds = [];

// Adds initial event listeners when the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startTimer').addEventListener('click', startWorkout);
    document.getElementById('pauseTimer').addEventListener('click', pauseResumeTimer);
    document.getElementById('resetTimer').addEventListener('click', resetTimer);
    // Assuming you have a button with id="addRound" for adding new rounds
    document.getElementById('addRound').addEventListener('click', addRound);
    
    // Add the first round by default
    addRound();
    
    // Initially, pause and reset buttons are disabled until the workout starts
    document.getElementById('pauseTimer').disabled = true;
    document.getElementById('resetTimer').disabled = true;
});

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
    // Reset workout rounds array and current positions
    workoutRounds = [];
    currentRound = 0;
    currentSet = 1;
    
    // Fetch and store total sets
    totalSets = parseInt(document.getElementById('numSets').value, 10) || 1;
    
    // Disable start button and enable pause and reset buttons
    document.getElementById('startTimer').disabled = true;
    document.getElementById('pauseTimer').disabled = false;
    document.getElementById('resetTimer').disabled = false;

    // Collect rounds data
    document.querySelectorAll('.round').forEach(roundDiv => {
        const workDuration = parseInt(roundDiv.querySelector('.workDuration').value, 10) || 0;
        const restDuration = parseInt(roundDiv.querySelector('.restDuration').value, 10) || 0;
        workoutRounds.push({workDuration, restDuration});
    });

    // Start the first round
    startNextRound();
}

function startNextRound() {
    if (currentRound < workoutRounds.length) {
        runTimer('Work', workoutRounds[currentRound].workDuration, () => {
            runTimer('Rest', workoutRounds[currentRound].restDuration, () => {
                currentRound++;
                startNextRound();
            });
        });
    } else if (currentSet < totalSets) {
        currentRound = 0; // Reset rounds for the next set
        currentSet++;
        startNextRound(); // Start the next set
    } else {
        alert('Workout Complete!');
        resetTimer();
    }
}

function runTimer(phase, duration, callback) {
    let time = duration;
    updateTimerDisplay(time);
    timer = setInterval(() => {
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
    isPaused = !isPaused;
    document.getElementById('pauseTimer').textContent = isPaused ? 'Resume' : 'Pause';
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    isPaused = false;
    currentSet = 1;
    currentRound = 0;
    workoutRounds = [];
    
    document.getElementById('timerDisplay').textContent = '00:00';
    document.getElementById('startTimer').disabled = false;
    document.getElementById('pauseTimer').disabled = true;
    document.getElementById('resetTimer').disabled = true;
    document.getElementById('pauseTimer').textContent = 'Pause';
    
    // Optionally clear the rounds inputs if you want a fresh start after reset
}

function updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById('timerDisplay').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
