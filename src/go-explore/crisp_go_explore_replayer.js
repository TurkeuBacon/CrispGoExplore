class CrispGoExploreReplayer {
    replaying;
    stop;
    deltaTime;
    commandList;
    currentTimeoutId;
    originalReplayOption;

    constructor() {
        this.replaying = false;
        this.stop = false;
        this.deltaTime = 1000 / 68;
    }

    startReplay(commandList) {
        if(this.currentTimeoutId != null) {
            clearTimeout(this.currentTimeoutId);
        }
        this.originalReplayOption = options.isReplayEnabled;
        options.isReplayEnabled = false;
        this.commandList = commandList;
        this.replaying = true;
        this.stop = false;
        ce_setMode(ce_REPLAY_MODE, {
            commandList: this.commandList
        });
        this.execute();
    }

    stopReplay() {
        if(!this.replaying) return;
        this.replaying = false;
        options.isReplayEnabled = this.originalReplayOption;
        this.stop = true;
        ce_setMode(ce_NORMAL_MODE);
    }

    execute() {
        if(!this.stop) {
            this.currentTimeoutId = setTimeout(this.execute.bind(this), 0);
        } else {
            this.stop = false;
        }
        if(ticks > this.commandList.length) {
            ticks = 0;
            score = 0;
        }
        update$3();
    }
}
export default CrispGoExploreReplayer;