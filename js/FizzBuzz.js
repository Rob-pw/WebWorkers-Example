/**
 * Created by robert on 05/02/14.
 */

/*
    I like using self-executing functions,
    they make it particularly easy to avoid
    polluting the global namespace.
 */
(function() {
    /*
        Let's create a new Worker,
        we need to provide it the location (from the HTML page)
        of the script to execute.
     */
    var fzBzWorker = new Worker('js/WebWorker::FizzBuzz.js')
        , output = document.getElementsByTagName('pre')[0]
        , messageCount = 0;

    /*
        Every time a message is received from the Worker,
        execute this function.
     */
    fzBzWorker.onmessage = function(e) {
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
            fzBzWorker.postMessage({
                command : "pause"
            });

            /*
                Then after 3.5s, let's resume work.
             */
            setTimeout(function() {
                fzBzWorker.postMessage({
                   command : "resume"
                });
            }, 2500);
        }
        output.innerText += "(" + e.status + ") : " + e.current + "\n";
    };

    /*
        Worker does nothing until the first message
     */
    fzBzWorker.postMessage({
        command : "start"
    });
})();