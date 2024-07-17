import Cell from "./cell.js";
import GoExploreInputHandler from "./go_explore_input_handler.js";
import ScreenReader from "./screen_reader.js";

const patchedFunctions = [
    'end',
    'char',
    'color',
    'text',
    'rect',
    'addScore',
];

class GoExplore {
    screenReader;
    exploreRateLabel;
    highestScoreLabel;
    exploreFrames;
    exploring;
    stop;
    deltaTime;
    nextFrameTime;
    inputHandler;
    frames;
    nextGo;
    cells;
    originalFunctions;
    runStartTime;
    frameCommandList;
    exploreCommandList;
    originalReplayOption;
    currentTimeoutId;
    goSourceKey;

    constructor() {
        this.currentTimeoutId = null;
        this.screenReader = new ScreenReader();
        this.stop = false;
        this.exploring = false;
        this.originalFunctions = new Map();
        this.originalEnd = null;
        this.originalChar = null;
        this.originalColor = null;
        this.goSourceKey = null;
        this.highestScoreLabel = document.createElement("label");
        this.highestScoreLabel.innerHTML = "Highest Score: 0";
        this.exploreRateLabel = document.createElement("label");
        this.exploreRateLabel.innerHTML = "Explore Rate: 0 fps";
        document.body.appendChild(document.createElement("hr"));
        document.body.appendChild(this.highestScoreLabel);
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(this.exploreRateLabel);
    }

    run(exploreFrames) {
        if(this.currentTimeoutId != null) {
            clearTimeout(this.currentTimeoutId);
        }
        this.inputHandler = new GoExploreInputHandler({ min: 50, max: 110 }, { min: 1, max: 1 });
        this.exploring = true;
        this.stop = false;
        this.exploreFrames = exploreFrames;
        this.deltaTime = 10;
        this.nextFrameTime = 0;
        this.goSourceKey = null;
        this.cells = new Map();
        this.exploreCommandList = [];
        this.frameCommandList = [];
        this.originalReplayOption = options.isReplayEnabled;
        options.isReplayEnabled = false;
        this.frames = 0; 
        this.nextGo = this.frames + this.exploreFrames;

        ce_setMode(ce_STEP_MODE);
        crispReboot();
        initInGame();
        ticks = 0;
        update$3();
        const cellKey = this.addCurrentCell();
        this.goSourceKey = cellKey;
        patchedFunctions.forEach(patchedFunction => {
            this.monkeyPatchFunction(true, patchedFunction);
        });
        this.runStartTime = performance.now();
        this.execute();
    }
    stopExplore() {
        if(!this.exploring) return;
        this.exploring = false;
        patchedFunctions.forEach(patchedFunction => {
            this.monkeyPatchFunction(false, patchedFunction);
        });
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

        for (let i = 0; i < 256; i++) {
            // const now = window.performance.now();
            // if (now < this.nextFrameTime) {
            //     continue;
            // }
            // this.nextFrameTime += this.deltaTime;
            // if (this.nextFrameTime < now || this.nextFrameTime > now + this.deltaTime * 2) {
            //     this.nextFrameTime = now + this.deltaTime;
            // }
            this.frameCommandList = [];
            this.explore();
            update$3();
            
            this.exploreCommandList.push(this.frameCommandList);
            this.frames++;
        }
    }
    go() {
        this.frameCommandList = [];
        this.exploreCommandList = [];
        let goKey;
        let minVisits = Number.MAX_VALUE;
        let highestScore = Number.MIN_VALUE;
        for (let [key, value] of this.cells) {
            if(value.numVisits < minVisits) {
                minVisits = value.numVisits;
                goKey = key;
            }
            if(value.frameState.score > highestScore) {
                highestScore = value.frameState.score;
            }
        }
        const exploreRate = (this.frames / ((performance.now()-this.runStartTime))*1000).toFixed(2);
        this.highestScoreLabel.innerHTML = "Highest Score: " + highestScore;
        this.exploreRateLabel.innerHTML = "Explore Rate: " + exploreRate + " fps";
        const goCell = this.cells.get(goKey);
        this.goSourceKey = goKey;
        loadFrameState(goCell.frameState, this.inputHandler);
        goCell.visit();
    }
    explore() {
        if(this.frames >= this.nextGo) {
            this.screenReader.updateScreen();
            if(!this.cells.has(this.screenReader.getLowResGrayImageString() + score)) {
                this.addCurrentCell();
            }
            this.go();
            this.nextGo = this.frames+this.exploreFrames;
        }
        const inputAction = this.inputHandler.getFrameAction(this.frames);
        switch(inputAction) {
            case this.inputHandler.INPUT_ACTIONS.PRESS:
                simulateKeyPress();
                break;
            case this.inputHandler.INPUT_ACTIONS.RELEASE:
                simulateKeyRelease();
                break;
            case this.inputHandler.INPUT_ACTIONS.NO_OP:
                break;
        }
        // const doInput = this.frames >= this.nextInputFrame;
        // if(doInput) {
        //     simulateKeyPress();
        //     this.nextInputFrame = this.getNextInputFrame();
        // } else if(input.isPressed) {
        //     simulateKeyRelease();
        // }
    }
    addCurrentCell() {
        const cellHash = [this.screenReader.getLowResGrayImageString(), score].join('');
        this.cells.set(cellHash, new Cell(getFrameState(this.inputHandler.getState()), this.exploreCommandList, this.goSourceKey));
        return cellHash;
    }
    getHighestScoreCell() {
        let highestScore = Number.MIN_VALUE;
        let highestKey;
        for (let [key, value] of this.cells) {
            if(value.frameState.score > highestScore) {
                highestScore = value.frameState.score;
                highestKey = key;
            }
        }
        return this.cells.get(highestKey);
    }
    monkeyPatchFunction(overriding, functionName) {
        if(overriding) {
            if(!this.originalFunctions.has(functionName)) {
                this.originalFunctions.set(functionName, globalThis[functionName]);
                globalThis[functionName] = this["ge_" + functionName].bind(this);
            }
        } else {
            if(this.originalFunctions.has(functionName)) {
                globalThis[functionName] = this.originalFunctions.get(functionName);
                this.originalFunctions.delete(functionName);
            }
        }
    }
    ge_end() {
        this.go();
    }
    ge_char(str, x, y, options) {
        const char = this.originalFunctions.get('char');
        this.frameCommandList.push(()=>{
            char(str, x, y, options);
        });
        return char(str, x, y, options);
    }
    ge_rect(x, y, width, height) {
        const rect = this.originalFunctions.get('rect');
        this.frameCommandList.push(()=>{
            rect(x, y, width, height);
        });
        return rect(x, y, width, height);
    }
    ge_text(str, x, y, options) {
        const text = this.originalFunctions.get('text');
        this.frameCommandList.push(()=>{
            text(str, x, y, options);
        });
        return text(str, x, y, options);
    }
    ge_color(colorName) {
        const color = this.originalFunctions.get('color');
        this.frameCommandList.push(()=>{
            color(colorName);
        });
        return color(colorName);
    }
    ge_addScore(value, x, y) {
        const addScore = this.originalFunctions.get('addScore');
        this.frameCommandList.push(()=>{
            addScore(value, x, y);
        });
        return addScore(value, x, y);
    }
}
export default GoExplore;