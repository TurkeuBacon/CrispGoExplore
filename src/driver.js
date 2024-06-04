import CrispGoExploreReplayer from "./crisp_go_explore_replayer.js";
import GoExplore from "./go_explore.js";

checkForCanvas();

function checkForCanvas()
{
    if(document.getElementsByTagName('canvas')[0] != undefined) {
        const goExplore = new GoExplore();
        const replayer = new CrispGoExploreReplayer();

        document.body.appendChild(document.createElement("hr"));

        const startExploreButton = document.createElement("button");
        startExploreButton.innerHTML = "START_EXPLORE";
        startExploreButton.onclick = () => {
            replayer.stopReplay();
            goExplore.run(100);
        };
        document.body.appendChild(startExploreButton);

        const stopExploreButton = document.createElement("button");
        stopExploreButton.innerHTML = "STOP_EXPLORE";
        stopExploreButton.onclick = () => {
            console.log("--------------------------------");
            goExplore.stopExplore();
        };
        document.body.appendChild(stopExploreButton);


        document.body.appendChild(document.createElement("hr"));
        const startReplayButton = document.createElement("button");
        startReplayButton.innerHTML = "START_REPLAY";
        startReplayButton.onclick = () => {
            goExplore.stopExplore();
            replayer.startReplay(getFullCommandList(goExplore.getHighestScoreCell(), goExplore));
        };
        document.body.appendChild(startReplayButton);

        const stopReplayButton = document.createElement("button");
        stopReplayButton.innerHTML = "STOP_REPLAY";
        stopReplayButton.onclick = () => {
            console.log("STOP REPLAY");
            replayer.stopReplay();
        };
        document.body.appendChild(stopReplayButton);
    } else {
        setTimeout(checkForCanvas, 100);
    }   
}

function getFullCommandList(cell, goExplore) {
    if(cell.sourceKey != null && goExplore.cells.has(cell.sourceKey)) {
        let fullCommandList = getFullCommandList(goExplore.cells.get(cell.sourceKey), goExplore);
        cell.commandList.forEach(e => {
            fullCommandList.push(e);
        });
        return fullCommandList;
    }
    return cell.commandList;
}