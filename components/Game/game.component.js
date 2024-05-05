import {
  GAME_STATES,
  MOVING_DIRECTIONS,
  SELECT_MANAGEMENT,
  getGameState,
  movePlayer,
  
} from "../../data.js";
import { GameGrid } from "./GameGrid/game-grid.component.js";
import { Lose } from "./Lose/lose.component.js";
import { ResultPanel } from "./ResultPanel/result-panel.component.js";
import { setSelectPlayer } from "./Settings/setSelectManagement.component.js";
import { Settings } from "./Settings/settings.component.js";
import { Win } from "./Win/win.component.js";
import { renderSettingsMenu } from './Settings/renderMenu.component.js';
import { renderOptionsMenu } from './Settings/renderOptionMenu.component.js';

// Create a variable to track the current control method
let player1ControlMethod = SELECT_MANAGEMENT.KEYBOARD; // Default to keyboard
let player2ControlMethod = SELECT_MANAGEMENT.KEYBOARD; // Default to keyboard


  document.addEventListener("keyup", event => {
    if (player1ControlMethod === SELECT_MANAGEMENT.KEYBOARD) {
        switch (event.code) {
            case "ArrowLeft":
                movePlayer(1, MOVING_DIRECTIONS.LEFT);
                break;
            case "ArrowRight":
                movePlayer(1, MOVING_DIRECTIONS.RIGHT);
                break;
            case "ArrowUp":
                movePlayer(1, MOVING_DIRECTIONS.UP);
                break;
            case "ArrowDown":
                movePlayer(1, MOVING_DIRECTIONS.DOWN);
                break;
        }
    }

    if (player2ControlMethod === SELECT_MANAGEMENT.KEYBOARD) {
        switch (event.code) {
            case "KeyA":
                movePlayer(2, MOVING_DIRECTIONS.LEFT);
                break;
            case "KeyD":
                movePlayer(2, MOVING_DIRECTIONS.RIGHT);
                break;
            case "KeyW":
                movePlayer(2, MOVING_DIRECTIONS.UP);
                break;
            case "KeyS":
                movePlayer(2, MOVING_DIRECTIONS.DOWN);
                break;
        }
    }
});

// Create a new instance of the speech recognition API
const recognition = new webkitSpeechRecognition();

// Set the recognition language to English
recognition.lang = "en-US";

// Specify if the recognition should be continuous
recognition.continuous = true;

// Установка промежуточных результатов в true, чтобы получать результаты по мере поступления
recognition.interimResults = true;

// Event listener for when recognition starts
recognition.rt = event => {
  console.log("Speech recognition started");
};

export function setControlMethod(playerNumber,method) {
  const gameState = getGameState();
  if (gameState === GAME_STATES.IN_PROGRESS) {
    console.log("Cannot change control method during the game");
    return;
  }

  if (playerNumber === 1) {
    player1ControlMethod = method;
    if (method === SELECT_MANAGEMENT.VOICE) {
      recognition.start();
    } else {
      recognition.stop();
    }
  } else if (playerNumber === 2) {
    player2ControlMethod = method;
  }
}

// Event listener for when recognition results are received

recognition.onresult = event => {
  if (player1ControlMethod !== SELECT_MANAGEMENT.VOICE) {
    return;
  }

  for (let i = event.resultsIndex; i < event.results.length; i++) {
    const result = event.results[i];
    if (result.isFinal) {
      const transcript = result[0].transcript.trim();

      handleCommand(transcript); // обработка каждого слова как команду
    }
  }


  const word = event.results[event.results.length - 1][0].transcript;
  console.log(word);
  switch (word.trim()) {
    case "left": {
      movePlayer(1, MOVING_DIRECTIONS.LEFT);
      break;
    }
    case "right": {
      movePlayer(1, MOVING_DIRECTIONS.RIGHT);
      break;
    }
    case "up": {
      movePlayer(1, MOVING_DIRECTIONS.UP);
      break;
    }
    case "down": {
      movePlayer(1, MOVING_DIRECTIONS.DOWN);
      break;
    }
  }
};

function handleCommand(transcript) {
  if (player1ControlMethod !== SELECT_MANAGEMENT.VOICE) {
    return;
  }
  switch (transcript.toLowerCase()) {
    case "left":
      movePlayer(1, MOVING_DIRECTIONS.LEFT);
      break;
    case "right":
      movePlayer(1, MOVING_DIRECTIONS.RIGHT);
      break;
    case "up":
      movePlayer(1, MOVING_DIRECTIONS.UP);
      break;
    case "down":
      movePlayer(1, MOVING_DIRECTIONS.DOWN);
      break;
  }
}



// Event listener for when recognition ends
recognition.onend = () => {
  console.log("Speech recognition ended");
};

// Event listener for any recognition errors
recognition.onerror = event => {
  console.error(`Speech recognition error: ${event.error}`);
};

// Start recognition
recognition.start();


export function Game() {
  const element = document.createElement("div");

  const gameState = getGameState();

  switch (gameState) {
    case GAME_STATES.IN_PROGRESS:
      element.append(ResultPanel(), GameGrid());
      break;
    case GAME_STATES.SETTINGS:
      element.append(renderSettingsMenu(), renderOptionsMenu(),setSelectPlayer(), Settings());
      break;
    case GAME_STATES.WIN:
      element.append(Win());
      break;
    case GAME_STATES.LOSE:
      element.append(Lose());
      break;
    default: {
      throw new Error("Not supported state");
    }
  }

  return element;
}
