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

// navigates through textboxes through keyboard commands (delete & enter keys)
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

// shows delete button when hovering over a task with words
todoList.addEventListener('mouseover', (event) => {
    const task = event.target.closest('.task');
    if (task) {
        const textbox = task.querySelector('.task-textbox');
        const deleteBtn = task.querySelector('.delete-btn');
        if (deleteBtn) {
            if (textbox.value.trim() !== '') {
                deleteBtn.style.display = 'inline-block'; // shows button
            } else {
                deleteBtn.style.display = 'none'; // hides button
            }
        }
    }
});

// hides delete button when hovering over a task with words
todoList.addEventListener('mouseout', (event) => {
    const task = event.target.closest('.task');
    if (task) {
        const deleteBtn = task.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.style.display = 'none'; // Hide button
        }
    }
});

// creates a new task on enter
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

// INSERT PLAYLIST FEATURE

let player;

// initiliazes player when api is ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    playerVars: {
      listType: 'playlist',
      list: '' // empty bc it's dynamically loaded
    },
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  console.log("YouTube Player is ready!");
}


document.getElementById("link-button").addEventListener("click", () => {
  let playlistLink = document.getElementById("playlist-link").value;
  let playlistId = extractPlaylistId(playlistLink);
   player.loadPlaylist({
      listType: 'playlist',
      list: playlistId
    });
    document.getElementById('placeholder-image').style.display = 'none';
    document.getElementById('player').style.display = 'block';
});

function extractPlaylistId(url) {
  let regex = /(?:list=)([a-zA-Z0-9_-]+)/;
  let match = url.match(regex);
  return match ? match[1] : null;
}

// CHANGE BACKGROUND FEATURE

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {

        let videoId = event.target.getVideoData().video_id;

        // Fetch data from Flask backend
        fetch(`/getColors/${videoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Couldn't get colors (network response issue)");
                }
                return response.json();
            })
            .then(data => {

                console.log(data)
                let [textColor, borderColor, backgroundColor] = data;

                // Update the styles of the webpage
                document.body.style.backgroundColor = backgroundColor;
                document.querySelectorAll("h1, button, input, p").forEach(element => {
                    element.style.color = textColor;
                });
                document.querySelectorAll("button, #placeholder-image, #todo-cntr").forEach(element => {
                    element.style.borderColor = borderColor;  // Dynamically set the border color
                });
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
   }

}

// UPCOMING FEATURE: SAVE PLAYLIST LINKS

// when hitting star button next to run playlist button, save link
    // get 'links' from local storage
    // push a certain link from 'input' field into local storage

// add a delete button on hover on individual links
    // get links from local storage
    // remove link from list

// add event listener for when dom content is loaded
    // for each link, make new <p> that has saved link (with star in front) and apphend to dom
