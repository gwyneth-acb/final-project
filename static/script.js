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

const todoList = document.getElementById('todo-list');

todoList.addEventListener('click', (event) => {

    // crossing textbox
    if (event.target && event.target.classList.contains('checkbox')) {
        const task = event.target.closest('.task');

        if (event.target.checked) {
            task.querySelector('.task-textbox').style.textDecoration = 'line-through';
        } else {
            task.querySelector('.task-textbox').style.textDecoration = 'none';
        }
    }

    // delete btn
    else if (event.target && event.target.classList.contains('delete-task')) {
        const task = event.target.closest('.task');
        task.remove();
    }
});

// Handle interactions with textboxes (keydown event, for Enter key)
todoList.addEventListener('keydown', (event) => {

    // entering
    if (event.target && event.target.classList.contains('task-textbox') && event.key === 'Enter') {
        const textbox = event.target;
        const currTask = textbox.closest('.task');

        if (textbox.value.trim() !== '' && currTask === todoList.lastElementChild) {
            let newTask = todoList.appendChild(createNewTask());
            newTask.querySelector('.task-textbox').focus();
        }

    // backspacing
    } else if (event.target && event.target.classList.contains('task-textbox') && event.key === 'Backspace') {

        const textbox = event.target;
        const currTask = textbox.closest('.task');

        // focus on previous textbox if it exists & remove curr task
        const previousTask = currTask.previousElementSibling;
        if (previousTask && textbox.value.trim() === '') {
            previousTask.querySelector('.task-textbox').focus();
            currTask.remove()
        }
    }
});

todoList.addEventListener('mouseover', (event) => {
    const task = event.target.closest('.task');
    if (task) {
        const textbox = task.querySelector('.task-textbox');
        const deleteBtn = task.querySelector('.delete-btn');
        if (deleteBtn) {
            if (textbox.value.trim() !== '') {
                deleteBtn.style.display = 'inline-block'; // Show button
            } else {
                deleteBtn.style.display = 'none'; // Hide button
            }
        }
    }
});

todoList.addEventListener('mouseout', (event) => {
    const task = event.target.closest('.task');
    if (task) {
        const deleteBtn = task.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.style.display = 'none'; // Hide button
        }
    }
});

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
    newButton.setAttribute('class', 'delete-task');

    //apphend
    newTask.appendChild(newCheckbox);
    newTask.appendChild(newText);
    newTask.appendChild(newButton);

    return newTask;
}



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
