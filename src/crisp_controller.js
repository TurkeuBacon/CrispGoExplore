const ce_NORMAL_MODE = 0;
const ce_STEP_MODE = 1;
const ce_REPLAY_MODE = 2;
let ce_currentMode;

let originalUpdate = null;

// document.addEventListener("keydown", (e) => {
//     console.log(e.code);
//     switch(e.code) {
//         case "Digit1":
//             ce_setMode(ce_NORMAL_MODE);
//             break;
//         case "Digit2":
//             ce_setMode(ce_STEP_MODE);
//             break;
//         // case "Digit3":
//         //     ce_setMode(ce_REPLAY_MODE);
//         //     break;
//         case "KeyR":
//             crispReboot();
//             break;
//         case "KeyE":
//             if(ce_currentMode == ce_STEP_MODE) {
//                 update$3();
//             }
//             break;
//         case "KeyS":
//             initInGame();
//             break;
//     }
// });

function ce_setMode(newMode, data) {
    ce_currentMode = newMode;
    switch(ce_currentMode) {
        case ce_NORMAL_MODE:
            monkeyPatchUpdate(false);
            crispTakeControl();
            break;
        case ce_STEP_MODE:
            monkeyPatchUpdate(false);
            crispGiveControl();
            break;
        case ce_REPLAY_MODE:
            crispTakeControl();
            monkeyPatchUpdate(true, data.commandList);
            crispReboot();
            initInGame();
            ticks = 0;
            break;
        default:
            break;
    }
}

function monkeyPatchUpdate(overriding, commandList) {
    if(overriding) {
        if(originalUpdate == null) {
            originalUpdate = update;
            update = () => {
                if(ticks >= commandList.length) return;
                for(const command of commandList[ticks]) {
                    command();
                }
            };
        }
    } else {
        if(originalUpdate != null) {
            update = originalUpdate;
            originalUpdate = null;
        }
    }
}