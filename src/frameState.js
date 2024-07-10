function getFrameState(inputState) {
    const gameState = getGameState();
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
    loadGameState(frameState.gameState);
}