/**
 *
 * Gwyneth Balite
 * 11/13
 *
 */

"use strict";

/**
 * Timer Feature
 */

let seconds = 0; // keeps track of time on timer
let timerControl; // 'controls' the timer

// all my buttons controlling the timer
const timerDisplay = document.getElementById("time")
const addTimes = document.querySelectorAll(".setter")
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');

// event listener adding time
addTimes.forEach(button => {
    button.addEventListener('click', function() {
        const addedTime = parseInt(button.getAttribute('adding'));
        seconds += addedTime;
        updateTimerDisplay();
    });
});

//updating timer display
function updateTimerDisplay() {

    if (seconds > 3599) {
        seconds = 3599; // caps the time at 59:59
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// starts countdown
function startTimer() {
    if (!timerControl && seconds > 0) {
        timerControl = setInterval(function() {
            if (seconds > 0) {
                seconds--;
                updateTimerDisplay();  // Update the display
            } else {
                clearInterval(timerControl);  // Stop the timer when it reaches 0
                timerControl = null;
            }
        }, 1000);
    }
}

// stops countdown
function stopTimer() {
    clearInterval(timerControl);
    timerControl = null;
}

// resets countdown
function resetTimer() {
    clearInterval(timerControl);
    timerControl = null;
    seconds = 0;  // Reset to 0
    updateTimerDisplay();  // Update the display
}

// Event listeners for the buttons
playBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);


/**
 * TO-DO FEATURE
 *
 * write event listener code
 *  [] for checkboxes => checking off things => strike through
 *  [] add 'delete button' when hovering over a task
 *    [] when clicking delete button, delete the task
 *  [] task things
 *    [] when empty teask, if backspacing, go back to previous row and be typing there
 *    [] when filled task & enter, make new task item
 *
 */

const checkbox = document.querySelector('input[type="checkbox"][name="checkbox"][value="completed"]');
const taskTextbox = document.querySelector('.task-textbox[name="task"]');

function strikethrough() {
    let text = checkbox.closest('.task').querySelector('.task-textbox');

    if (checkbox.checked) {
      text.style.textDecoration = 'line-through';
    } else {
      text.style.textDecoration = 'none';
    }
}


// makes and new task div
function toNextLine(event) {
    if (event.key === 'Enter' && taskTextbox.value.trim() !== '') {

        let newTask = createNewTask();
        let newTaskTextbox = newTask.querySelector('input[type="text"]');
        newTaskTextbox.addEventListener("keydown", (event) => {
            if (event.key === 'Enter' && newTaskTextbox.value.trim() !== '') {
                let newestTask = document.getElementById("todo-list").appendChild(createNewTask());
                let newestTextbox = newestTask.querySelector('input[type="text"]');
                newestTextbox.focus()
            }
        })

        document.getElementById("todo-list").appendChild(newTask);
        newTaskTextbox.focus()

    }
}

function createNewTask() {

    //make new div
    let newTask = document.createElement("div");
    newTask.classList.add('task');

    // make checkbox
    let newCheckbox = document.createElement("input");
    newCheckbox.setAttribute('type', 'checkbox');
    newCheckbox.setAttribute('name', 'checkbox');
    newCheckbox.setAttribute('value', 'completed');
    newCheckbox.classList.add('checkbox');

    // textinput
    let newText = document.createElement("input");
    newText.setAttribute('type', 'text');
    newText.setAttribute('name', 'task');
    newText.classList.add('task-textbox');

    // make delete button
    let newButton = document.createElement("button");
    newButton.textContent = "❌";
    newButton.setAttribute('id', 'delete-task');

    //apphend
    newTask.appendChild(newCheckbox);
    newTask.appendChild(newText);
    newTask.appendChild(newButton);

    return newTask;
}

checkbox.addEventListener("change", strikethrough);
taskTextbox.addEventListener("keydown", (event) => {
    toNextLine(event);
})



/**
 * INSERT PLAYLIST FEATURE
 *   [] add input for inserting url
 *   [] initialize player
 *   [] create 'load' function that plays from specific url
 *   [] when pressing play button, do the following
 *    - get the playlist ID from the url
 *    - replace temp image with 'player'
 *    = call load function
 *    = potentially save previously used playlists in local storage and be able to play it again
 *
 * CHANGE BACKGROUND FEATURE
 *  [] create an 'on player state change' function
 *    = if the same video is playing, do nothign
 *    = else, get video id
 *    = w/ video id, send a fetch request to flask
 *    = also get a fetch request from affirmations api and change that
 *    = should return 3 colors,
 *    = change colors of the screen
 *
 */
