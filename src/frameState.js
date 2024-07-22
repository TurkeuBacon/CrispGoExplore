function getFrameState(inputState) {
    const gameState = getGameState(GAME_STATE_VAR_NAMES)
    return {
        ticks: ticks,
        score: score,
        inputState: inputState,
        gameState: gameState
    }
}
function loadFrameState(frameState, inputHandler) {
    ticks = frameState.ticks;
    score = frameState.score;
    inputHandler.setState(frameState.inputState);
    loadGameState(frameState.gameState, GAME_STATE_VAR_NAMES);
}

// const GAME_STATE_VAR_NAMES = ["dots", "multiplier", "powerTicks", "animTicks", "player", "enemy"];
const GAME_STATE_VAR_NAMES = ["objs",
    "nextObjDist",
    "inhalingCoins",
    "coinMultiplier",
    "coinPenaltyMultiplier",
    "enemyMultiplier",
    "shotX",
    "shotSize",
    "charge",
    "penaltyVx",
    "prevType",];
const DELAY_RANGE = { min: 10, max: 60 };
const LENGTH_RANGE = { min: 1, max: 30 };

function getGameState(variableNames) {
    const variablesCopy = {};
    variableNames.forEach(variableName => {
        let variable = eval(variableName);
        variablesCopy[variableName] = getVariableCopy(variable);
    });
    return variablesCopy;
}
function getVariableCopy(variable) {
    let variableType = Array.isArray(variable) ? "Array" : typeof variable;
    switch(variableType) {
        case "Array":
            const arrayCopy = [];
            variable.forEach(variableElement => {
                arrayCopy.push(getVariableCopy(variableElement));
            });
            return arrayCopy;
        case "object":
            return Object.assign({}, variable);
        default:
            return variable;
    }
}
function loadGameState(gameState, variableNames) {
    variableNames.forEach(variableName => {
        const variablesCopy = getVariableCopy(gameState[variableName]);
        eval(variableName + " = variablesCopy;");
    });
}