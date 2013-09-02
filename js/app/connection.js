/*jshint browser: true, undef:true, unused:true, indent: 4 */
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

        get type() {

            return navigator.connection ? navigator.connection.type : "ethernet";
        },

        get isFast() {
            return this.type === "wifi" || this.type === "ethernet";
        },

        init: function () {

            // Setup initial state
            isOnline = navigator.connection ? navigator.connection.type !== "none" : navigator.onLine;

            // Register event handlers
            Andamio.dom.doc.on("offline", this.goOffline);
            Andamio.dom.doc.on("online",  this.goOnline);
        }
    };

})();
