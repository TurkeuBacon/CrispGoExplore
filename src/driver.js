import GoExplore from "./go_explore.js";

checkForCanvas();

function checkForCanvas()
{
    if(document.getElementsByTagName('canvas')[0] != undefined) {
        const goExplore = new GoExplore();
        goExplore.run(100);
    } else {
        setTimeout(checkForCanvas, 100);
    }   
}