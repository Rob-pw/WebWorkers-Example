/**
* Created by robert on 05/02/14.
*/
"use strict";
/**
 * Let's create a new (Dedicated Web)Worker,
 * we need to provide it the location (from the HTML page)
 * of the script to execute.
 */
var dediWorker = new Worker('js/WebWorker_Countdown.js'),
    wwOutput = document.querySelector('#webworker pre'),
    mainOutput = document.querySelector('#main pre');
/**
 * Sends a command to dediWorker
 * @param command A string which represents the command
 */
function sendCommand(command) {
    if (command === "reset") {
        var onmessage = dediWorker.onmessage;

        dediWorker.terminate();
        dediWorker = new Worker('js/WebWorker_Countdown.js');
        dediWorker.onmessage = onmessage;

        wwOutput.innerText = "** New WebWorker Created **\n";
        mainOutput.innerText = "** Output Cleared **\n";
    } else if (command === "terminate") {
        dediWorker.terminate();
    } else {
        dediWorker.postMessage({
            command : command
        });
    }

    mainOutput.innerText += command + "\n";
}

/**
 * Every time a message is received from the Worker,
 * execute this function.
 */
dediWorker.onmessage = function (e) {
    var data = e.data;
    wwOutput.innerText += "(" + data.status + ") : " + data.current + "\n";
};