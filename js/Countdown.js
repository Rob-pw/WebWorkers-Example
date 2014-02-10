/**
 * Created by robert on 05/02/14.
 */

/*
    Let's create a new Worker,
    we need to provide it the location (from the HTML page)
    of the script to execute.
 */
var dediWorker = new Worker('js/WebWorker::Countdown.js')
    , output = document.getElementsByTagName('pre')[0]
    , messageCount = 0;

/*
    Every time a message is received from the Worker,
    execute this function.
 */
dediWorker.onmessage = function(e) {
    e = e.data;
    messageCount += 1;

    /*
        After 5 messages
     */
    if(messageCount === 5) {
        /*
            Send a message to the worker,
            telling it to pause.
         */
        dediWorker.postMessage({
            command : "pause"
        });

        /*
            Then after 3.5s, let's resume work.
         */
        setTimeout(function() {
            dediWorker.postMessage({
               command : "resume"
            });
        }, 2500);
    }
    output.innerText += "(" + e.status + ") : " + e.current + "\n";
};

/*
    Worker does nothing until the first message
 */
dediWorker.postMessage({
    command : "start"
});