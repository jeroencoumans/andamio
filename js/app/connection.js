/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

Andamio.connection = (function () {

    var isOnline;

    return {

        goOnline: function () {
            isOnline = true;
            Andamio.dom.html.removeClass("is-offline");
        },

        goOffline: function () {

            isOnline = false;
            Andamio.dom.html.addClass("is-offline");
        },

        get status() {
            return isOnline;
        },

        init: function () {

            isOnline = navigator.onLine;

            Andamio.dom.win.on("offline", this.goOffline);
            Andamio.dom.win.on("online",  this.goOnline);
        }
    };

})();
