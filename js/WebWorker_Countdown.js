/**
 * Created by robert on 06/02/14.
 */

/*
    Worker object, prevents accidental pollution of global namespace with variables,
    limits global variables to one (DediWorker),
    encapsulates private variables and functions,
    provides a public interface.
 */
var DediWorker = (function () {
    "use strict";
    /*
        max: the number we will start counting down from;
        current: the number we are currently on;
        interval: the interval ID of the asynchronous function.
     */
    var max = 1e6,
        step = 0.1 * max,
        current = max,
        interval;

    function operation() {
        interval = setInterval(function () {
            /*
                It is considerably faster to loop internally,
                rather than using setInterval.

                Hence I perform a couple thousand loops,
                then allow for the operation to be paused.
             */
            var loopsLeft = 1500;

            while ((loopsLeft -= 1) >= 0) {

                /*
                    Let's feedback every time we hit another 10%,
                    this just lets the user know what's going on.
                 */
                if (current % step === 0) {

                    /*
                        If the current number is 0,
                        we have reached the end.
                     */
                    if (current === 0) {
                        postMessage({
                            status : "complete",
                            current : current
                        });

                        /*
                         Close the WebWorker ourselves.
                         */
                        close();
                    } else {
                        postMessage({
                            status : "incomplete",
                            current : current
                        });
                    }
                }

                /*
                    The actual "work" part of the operation,
                    all we're really doing is counting down
                    from a big number.
                 */
                current -= 1;
            }
        /*
            A delay of 0ms essentially means,
            "Whenever you're free, do this"
         */
        }, 0);
    }

    /*
        Let's define our public interface,
        these are the only properties visible outside
        of this object.
     */
    return {
        start : operation,

        pause : function () {
            /*
                Inform the main thread of where we're up to
             */
            postMessage({
                status : "paused",
                current : current
            });

            /*
                Stop operation from being called
             */
            clearInterval(interval);
            interval = undefined;
        },

        resume : function () {
            if (!interval) {
                operation();
            }
        }
    };
}());

/**
 * Add an event listener to message,
 * get the command from the data property,
 * if such command exists then execute it.
 */
addEventListener('message', function (e) {
    "use strict";

    var data = e.data,
        cmd;

    if (!data.command) {
        console.log("No command supplied.");
    }

    cmd = DediWorker[data.command];
    if (!cmd) {
        throw "'" + cmd + "' is not a valid command.";
    } else {
        cmd();
    }
});