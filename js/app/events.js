/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */
Andamio.events = (function () {

    var isLocked = false,
        lockTimer;

    return {

        get status() {
            return isLocked;
        },

        lock: function (timeout) {

            if (! isLocked) {

                isLocked = true;
                timeout = (typeof timeout === "number" && timeout > 0) ? timeout : 300;

                lockTimer = setTimeout(function () {

                    isLocked = false;
                }, timeout);
            }
        },

        unlock: function () {

            clearTimeout(lockTimer);
            isLocked = false;
        },

        attach: function (selector, fn, lock) {

            Andamio.dom.viewport.on("click", selector, function (event) {

                if (! isLocked) {

                    if (lock) {
                        Andamio.events.lock();
                    }

                    fn(event);
                }

                return false;
            });
        }
    };
})();
