
class GoExploreInputHandler {

    INPUT_ACTIONS = {
        NO_OP: -1,
        PRESS: 0,
        RELEASE: 1
    }
    // Stores the range of frames between release and press at index 0 (delay)
    // Stores the range of frames between press and release at index 1 (length)
    actionTimingRanges;

    nextAction;
    nextActionFrame;

    constructor(delayRange, lengthRange) {
        this.actionTimingRanges = [delayRange, lengthRange];
        this.getNextAction(this.INPUT_ACTIONS.RELEASE, 0);
    }

    // Returns the input action to take this frame
    getFrameAction(frame) {
        if(frame >= this.nextActionFrame) {
            let currentAction = this.nextAction;
            this.getNextAction(currentAction, frame);
            return currentAction;
        } else if(this.nextAction == this.INPUT_ACTIONS.RELEASE) {
            return this.INPUT_ACTIONS.PRESS;
        } else {
            return this.INPUT_ACTIONS.NO_OP;
        }
    }
    getNextAction(lastAction, currentFrame) {
        this.nextAction = (lastAction+1)%2;
        const framesMin = this.actionTimingRanges[this.nextAction].min;
        const framesSpan = this.actionTimingRanges[this.nextAction].max - framesMin;
        this.nextActionFrame = currentFrame + framesMin + Math.floor(Math.random()*(framesSpan+1));
    }
    getState() {
        return {
            nextAction: this.nextAction,
            nextActionFrame: this.nextActionFrame,
        }
    }
    setState(inputHandlerState) {
        this.nextAction = inputHandlerState.nextAction;
        this.nextActionFrame = inputHandlerState.nextActionFrame;
    }
}
export default GoExploreInputHandler;