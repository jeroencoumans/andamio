/*jshint es5: true, browser: true */
/*global Andamio */
Andamio.events = (function () {

    "use strict";

    return {
        attach: function(selector, fn, bubbles) {

            Andamio.dom.viewport.on("click", selector, function(event) {
                fn(event);
                if (bubbles !== true) {
                    return false;
                }
            });
        }
    };
})();
