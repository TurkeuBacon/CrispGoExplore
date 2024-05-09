import Cell from "./cell.js";
import ScreenReader from "./screen_reader.js";
class GoExplore {
    screenReader;
    exploreFrames;
    stop;
    deltaTime;
    nextFrameTime;
    nextInputFrame;
    frames;
    nextGo;
    cells;
    workingPath;
    oldEnd;

    constructor() {
        this.screenReader = new ScreenReader();
        this.stop = false;
        this.deltaTime = 10;
        this.nextFrameTime = 0;
    }

    run(exploreFrames) {
        this.cells = new Map();
        this.workingPath = [];
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
        if(this.frames >= this.nextGo) {
            if(!this.cells.has(this.screenReader.getLowResGrayImageString() + ":" + score)) {
                this.addCurrentCell();
            }
            this.go();
            this.nextGo = this.frames+this.exploreFrames;
        }
        // const now = window.performance.now();
        // if (now < this.nextFrameTime) {
        //     return;
        // }
        // this.nextFrameTime += this.deltaTime;
        // if (this.nextFrameTime < now || this.nextFrameTime > now + this.deltaTime * 2) {
        //     this.nextFrameTime = now + this.deltaTime;
        // }
        this.explore();
        document.dispatchEvent(new KeyboardEvent('advanceframe', null));

        this.frames++;
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
            if(value.score > highestScore) {
                highestScore = value.score;
            }
        }
        console.log("MIN VISITS: " + minVisits);
        console.log("HIGHEST SCORE: " + highestScore);
        const goCell = this.cells.get(goKey);
        const pathCopy = [];
        goCell.path.forEach(pressed => {
            pathCopy.push(pressed);
        });
        this.workingPath = pathCopy;
        loadFrameState(goCell.frameState);
        goCell.visit();
    }
    explore() {
        this.screenReader.updateScreen();
        // console.log("EXPLORE");
        const doInput = this.frames >= this.nextInputFrame;
        if(doInput) {
            document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'a'}));
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'a'}));
            this.nextInputFrame = this.getNextInputFrame();
        }
        this.workingPath.push(doInput);
    }
    getNextInputFrame() {
        return this.frames + Math.floor(Math.random() * 60)+40;
    }
    addCurrentCell() {
        const cellHash = this.screenReader.getLowResGrayImageString() + ":" + score;
        const pathCopy = [];
        this.workingPath.forEach(pressed => {
            pathCopy.push(pressed);
        });
        this.cells.set(cellHash, new Cell(getFrameState(), pathCopy, cellHash, score));
    }
}
export default GoExplore;