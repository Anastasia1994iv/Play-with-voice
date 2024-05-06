export const GAME_STATES = {
    SETTINGS: 'settings',
    IN_PROGRESS: 'in_progress',
    WIN: 'win',
    LOSE: 'lose'
}

export const MOVING_DIRECTIONS = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
}

export const SELECT_MANAGEMENT = {
  KEYBOARD: "keyboard",
  VOICE: "voice",
};

const _data = {
    gameState: GAME_STATES.SETTINGS,
    settings: {
       settingsMenu: [
        {
            name: 'Grid Size',
            value: [{ x: 4, y: 4}, { x: 5, y: 5}, { x: 6, y: 6}, 
            {x: 7, y: 7}, { x: 8, y: 8}],
            render: (value) => `${value.x} x ${value.y}`
        },
        {
            name: 'Points to Win',
            value: [ 3, 20, 40, 50, 60, 80],
        },
        {
            name: 'Points to Lose',
            value: [5, 10, 15, 20, 25],
        },
        {
            name: 'Select Management for Player1',
            value: ['keyboard', 'voice'],
        },
        {
            name: 'Sound',
            value: true,
            render: (value) => `Sound ${value ? 'On' : 'Off'}`
        },
    ],
      
        // selectName: ['Grid size', 'Points to win', 'Points to lose', 'Select Management for Player1', 'Sound'],
        // gridSize: [{ x: 4, y: 4}, { x: 5, y: 5}, { x: 6, y: 6}, {x: 7, y: 7}, { x: 8, y: 8}],
        // gameMode: ['Single', 'Multiplayer'],
        // choicePlayer: ['Catching', 'Running'],
        // pointsToWin: [ 3, 20, 40, 50, 60, 80],
        // pointsToLose: [5, 10, 15, 20, 25],
        // isSound: true,
    
        googleJumpInterval: 4000
    },
    catch: {
        player1: 0,
        player2: 0
    },
    miss: 0,
    time: new Date(),
    heroes: {
        google: {
            x: 0, 
            y: 0
        },
        player1: {x: 1, y: 1},
        player2: {x: 2, y: 2}
    }
}

let _observer = () => {} 

function _changeGoogleCoords() {
    // todo: using do while  prevent generating the same coordinates


    let newX = _data.heroes.google.x;
    let newY = _data.heroes.google.y;


    do {
        newX = _getRandomInt(_data.settings.gridSize.x - 1);
        newY = _getRandomInt(_data.settings.gridSize.y - 1);

        var newCoordsMatchWithPlayer1Coords = newX === _data.heroes.player1.x &&  newY === _data.heroes.player1.y;
        var newCoordsMatchWithPlayer2Coords = newX === _data.heroes.player2.x &&  newY === _data.heroes.player2.y;
    } while (newCoordsMatchWithPlayer1Coords || newCoordsMatchWithPlayer2Coords) // true

    _data.heroes.google.x = newX;
    _data.heroes.google.y = newY;
}

/**
 * 
 * @param max любое целое положительное число, включая которое будет генерироваться значение от 0 (включая) до этого числа  
 * @returns 
 */
function _getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let jumpIntervalId;

function _stopGoogleJump() {
    clearInterval(jumpIntervalId);
}

function _runGoogleJump() {
    jumpIntervalId = setInterval(() => {
        _changeGoogleCoords();
        _data.miss++;
        if (_data.miss === _data.settings.pointsToLose) {
            _stopGoogleJump();
            _data.gameState = GAME_STATES.LOSE;
        }
        _observer();
    }, _data.settings.googleJumpInterval)
}

function _catchGoogle(playerNumber) {
    _stopGoogleJump();

    _data.catch[`player${playerNumber}`]++;

    if (_data.catch[`player${playerNumber}`] === _data.settings.pointsToWin) {
        _data.gameState = GAME_STATES.WIN;
    } else {
        _changeGoogleCoords();
        _runGoogleJump();
    }

    _observer();
}

function _checkIsCoordInValidRange(coords) {
    const xIsCorrect = coords.x >= 0 && coords.x < _data.settings.gridSize.x;
    const yIsCorrect = coords.y >= 0 && coords.y < _data.settings.gridSize.y;

    return xIsCorrect && yIsCorrect
}

function _coordsMatchWithOtherPlayer(coords) {
    const player1IsInThisCell = coords.x === _data.heroes.player1.x && coords.y === _data.heroes.player1.y;
    const player2IsInThisCell = coords.x === _data.heroes.player2.x && coords.y === _data.heroes.player2.y;

    return player1IsInThisCell || player2IsInThisCell
}

function _coordsMatchWithGoogle(coords) {
    const googleIsInThisCell = coords.x === _data.heroes.google.x && coords.y === _data.heroes.google.y;
    return googleIsInThisCell;
}


// setter / mutation / command
export function addEventListener(subscriber) {
    _observer = subscriber
}

export function setGridSize(x, y) {
    if (x < 1) throw new Error('Incorrect X grid size settings');
    if (y < 1) throw new Error('Incorrect Y grid size settings');

    _data.settings.gridSize.x = x;
    _data.settings.gridSize.y = y;
}

export function start() {
    if (_data.gameState !== GAME_STATES.SETTINGS) {
        throw new Error('Game cannot be started from state: ' + _data.gameState);
    }

    _data.gameState = GAME_STATES.IN_PROGRESS;
    _runGoogleJump();
    _observer();
}



export function playAgain() {
    _data.miss = 0;
    _data.catch = 0;
    _data.gameState = GAME_STATES.SETTINGS;
    _observer();
}

export function movePlayer(playerNumber, direction) {
    validatePlayerNumberOrThrow(playerNumber);

    if (_data.gameState !== GAME_STATES.IN_PROGRESS) {
        return;
    }

    const newCoords = {..._data.heroes[`player${playerNumber}`]};
    
    switch(direction) {
        case MOVING_DIRECTIONS.LEFT: {
            newCoords.x--;
            break;
        } 
        case MOVING_DIRECTIONS.RIGHT: {
            newCoords.x++;
            break;
        }
        case MOVING_DIRECTIONS.UP: {
            newCoords.y--;
            break;
        } 
        case MOVING_DIRECTIONS.DOWN: {
            newCoords.y++;
            break;
        }
    }

    

    const isValid = _checkIsCoordInValidRange(newCoords);
    if (!isValid) return;

    const isMatchWithOtherPlayer = _coordsMatchWithOtherPlayer(newCoords)
    if (isMatchWithOtherPlayer) return;

    const isMatchWithGoogle = _coordsMatchWithGoogle(newCoords)
    if (isMatchWithGoogle) {
        _catchGoogle(playerNumber)
    };

    _data.heroes[`player${playerNumber}`] = newCoords;

    _observer();
    
}



// getter/selector/query

/**
 * 
 * @returns кол-во баллов, заработанных пользователем
 */
export function getCatchCount() {
    return _data.catch;
}

export function getMissCount() {
    return _data.miss;
}

export function getGoogleCoords() {
    return _data.heroes.google
    
}

export function getPlayer1Coords() {
    return _data.heroes.player1
    
}

export function getPlayer2Coords() {
    return _data.heroes.player2

}

export function getSelectName() {
    return _data.settings.selectName
}
export function getGridSizeSettings() {
    return _data.settings.gridSize
    
}

export function getGameState() {
    return _data.gameState;
}

export function gameMode() {
    return _data.settings.gameMode
    
}

export function choicePlayer() {
    return _data.settings.choice
}
export function pointsToWin() {
    return _data.settings.points
}

export function pointsToLose() {
    return _data.settings.pointsT
}

export function isSound() {
    return _data.settings.isSound
    
}


export function stAllMenu() {
    return _data.settings.settingsMenu
}

export function validatePlayerNumberOrThrow(playerNumber) {
    if (![1,2].some(number => number === playerNumber)) {
        throw new Error('Incorrect player number');
    }
}