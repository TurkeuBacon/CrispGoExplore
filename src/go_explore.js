import Cell from "./cell.js";
import ScreenReader from "./screen_reader.js";
class GoExplore {
    screenReader;
    exploreRateLabel;
    highestScoreLabel;
    exploreFrames;
    stop;
    deltaTime;
    nextFrameTime;
    nextInputFrame;
    frames;
    nextGo;
    cells;
    oldEnd;
    runStartTime;

    constructor() {
        this.screenReader = new ScreenReader();
        this.stop = false;
        this.deltaTime = 0;
        this.nextFrameTime = 0;
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
        this.cells = new Map();
        if(this.oldEnd == null || this.oldEnd == undefined) {
            this.oldEnd = end;
        }
        end = ()=>{
            console.log("END");
            this.go();
        };
        this.frames = 0;
        this.nextInputFrame = this.getNextInputFrame();
        this.exploreFrames = exploreFrames;
        this.nextGo = this.frames + this.exploreFrames;
        this.waitForRun();
        // setInterval(this.execute.bind(this), 0);
    }
    waitForRun() {
        if(ticks < 0) {
            document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'a'}));
            document.dispatchEvent(new KeyboardEvent('advanceframe', null));
            setTimeout(this.waitForRun.bind(this), 100);
        } else if(ticks == 0) {
            document.dispatchEvent(new KeyboardEvent('advanceframe', null));
            setTimeout(this.waitForRun.bind(this), 100);
        } else if(ticks == 1) {
            this.addCurrentCell();
            this.runStartTime = performance.now();
            this.execute();
        }
        console.log(ticks);
    }
    stop() {
        end = this.oldEnd;
        this.oldEnd = null;
    }
    execute() {
        if(!this.stop) {
            setTimeout(this.execute.bind(this), 0);
        }
        // const now = window.performance.now();
        // if (now < this.nextFrameTime) {
        //     return;
        // }
        // this.nextFrameTime += this.deltaTime;
        // if (this.nextFrameTime < now || this.nextFrameTime > now + this.deltaTime * 2) {
        //     this.nextFrameTime = now + this.deltaTime;
        // }

        for (let i = 0; i < 256; i++) {
            this.explore();
            update$3();
            this.frames++;
        }
    }
    go() {
        console.log("GO");
        console.log("CELLS: " + this.cells.size);
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
        console.log("MIN VISITS: " + minVisits);
        console.log("HIGHEST SCORE: " + highestScore);
        const exploreRate = (this.frames / ((performance.now()-this.runStartTime))*1000).toFixed(2);
        this.highestScoreLabel.innerHTML = "Highest Score: " + highestScore;
        this.exploreRateLabel.innerHTML = "Explore Rate: " + exploreRate + " fps";
        console.log("Exploration Rate: " + exploreRate + " FPS");
        const goCell = this.cells.get(goKey);
        loadFrameState(goCell.frameState);
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
        // console.log("EXPLORE");
        const doInput = this.frames >= this.nextInputFrame;
        if(doInput) {
            document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'a'}));
            this.nextInputFrame = this.getNextInputFrame();
        }
    }
    getNextInputFrame() {
        return this.frames + Math.floor(Math.random() * 60)+40;
    }
    addCurrentCell() {
        const cellHash = [this.screenReader.getLowResGrayImageString(), score].join('');
        this.cells.set(cellHash, new Cell(getFrameState()));
    }
}
export default GoExplore;