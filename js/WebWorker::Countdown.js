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
    var max = 5e5,
        step = 0.1 * max
        , current = max
        , interval;

    console.log("foo");

    function operation() {
        interval = setInterval(function() {
            /*
                It is considerably faster to loop internally,
                rather than using setInterval.

                Hence I perform a couple thousand loops,
                then allow for the operation to be paused.
             */
            console.log('wertyuiop');
            console.time("Countdown")
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

                        console.log("complete");
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
            console.timeEnd("Countdown");
        /*
            A delay of 0ms essentially means,
            "Whenever you're free, do this"
         */
        }, 0);
    }

    addEventListener('message', function(e) {
        e = e.data;
        console.log(e.command, e.data);

        if(!e.command) {
            console.log("No command supplied.");
            return false;
        }

        var cmd = DediWorker[e.command];
        return cmd ? cmd(e.data) : null;
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