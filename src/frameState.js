function getFrameState() {
    const gameState = getGameState();
    return {
        ticks: ticks,
        score: score,
        gameState: gameState
    }
}
function loadFrameState(frameState) {
    ticks = frameState.ticks;
    score = frameState.score;
    loadGameState(frameState.gameState);
}