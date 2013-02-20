/*jshint es5: true, browser: true */
/*global Andamio */

Andamio.connection = (function () {

    "use strict";

    var offlineMessage;

    return {

        goOnline: function () {
            Andamio.dom.html.removeClass("is-offline");
            Andamio.alert.status = false;
        },

        goOffline: function () {
            Andamio.dom.html.addClass("is-offline");
            Andamio.alert.show(offlineMessage);
        },

        get status() {
            return !Andamio.dom.html.hasClass("is-offline");
        },

        set status(value) {
            if (value) {
                Andamio.connection.goOnline();
            } else {
                Andamio.connection.goOffline();
            }
        },

        init: function () {
            var self = this;
            self.status = !Andamio.dom.html.hasClass("is-offline");
            offlineMessage = Andamio.config.offlineMessage || '<a href="javascript:void(0)" class="action-refresh">It appears your connection isn\'t working. Try again.</a>';

            Andamio.dom.doc.on("ajaxSuccess", self.goOnline);
            Andamio.dom.doc.on("ajaxError", self.goOffline);
        }
    };
})();
