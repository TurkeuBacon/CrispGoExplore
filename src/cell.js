class Cell {
    frameState;
    path;
    hash;
    numVisits;
    score;
    constructor(frameState, path, hash, score) {
        this.frameState = frameState;
        this.path = path;
        this.hash = hash;
        this.numVisits = 1;
        this.score = score;
    }
    visit() {
        this.numVisits++;
    }

}
export default Cell