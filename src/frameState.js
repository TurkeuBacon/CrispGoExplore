function getFrameState() {
    const gameState = getGameState();
    return {
        ticks: ticks,
        score: score,
        randomState: random.getState(),
        gameState: gameState
    }
}
function loadFrameState(frameState) {
    ticks = frameState.ticks;
    score = frameState.score;
    const rs = frameState.randomState;
    random.setSeed(rs.w, rs.x, rs.y, rs.z, 0);
    loadGameState(frameState.gameState);
}