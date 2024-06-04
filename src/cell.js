class Cell {
    frameState;
    commandList;
    sourceKey;
    numVisits;
    constructor(frameState, commandList, sourceKey) {
        this.frameState = frameState;
        this.commandList = commandList;
        this.sourceKey = sourceKey;
        this.numVisits = 1;
    }
    visit() {
        this.numVisits++;
    }

}
export default Cell