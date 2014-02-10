/**
 * Created by robert on 06/02/14.
 */

/*
    Worker object.
 */
var DediWorker = (function() {
    /*
        max: the number we will start counting down from;
        current: the number we are currently on;
        interval: the interval ID of the asynchronous function.
     */
    var max = 1e6,
        step = 0.1 * max
        , current = max
        , interval;

    function operation() {
        interval = setInterval(function() {
            /*
                It is considerably faster to loop internally,
                rather than using setInterval.

                Hence I perform a couple thousand loops,
                then allow for the operation to be paused.
             */
            var loopsLeft = 1500;

            while(loopsLeft -= 1) {

                /*
                    Let's feedback every time we hit another 10%,
                    this just lets the user know what's going on.
                 */
                if(current % step === 0) {

                    /*
                        If the current number is 0,
                        we have reached the end.
                     */
                    if(current == 0) {
                        postMessage({
                            status : "complete",
                            current : current
                        });

                        /*
                         Close the WebWorker ourselves.
                         */
                        self.close();
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

    addEventListener('message', function(e) {
        var data = e.data;

        if(!data.command) {
            console.log("No command supplied.");
            return false;
        }

        var cmd = DediWorker[data.command];
        return cmd ? cmd(data.data) : null;
    });

    /*
        Let's define our public api.
     */
    return {
        start : operation,

        pause : function() {
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

        resume : function() {
            if(!interval) {
                operation();
            }
        }
    }
})();