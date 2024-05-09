class Cell {
    frameState;
    numVisits;
    constructor(frameState) {
        this.frameState = frameState;
        this.numVisits = 1;
    }
    visit() {
        this.numVisits++;
    }

}
export default Cell