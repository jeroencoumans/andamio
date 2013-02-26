/*jshint es5: true, browser: true, undef:true, unused:true */
/*global Andamio */

Andamio.connection = (function () {

    var isOnline,
        offlineMessage;

    return {

        goOnline: function () {
            isOnline = true;
            Andamio.alert.hide();
        },

        goOffline: function () {
            isOnline = false;
            Andamio.alert.show(offlineMessage);
        },

        get status() {
            return isOnline;
        },

        init: function () {

            var self = this;
            isOnline = true;
            offlineMessage = Andamio.config.offlineMessage || '<a href="javascript:void(0)" class="action-refresh">It appears your connection isn\'t working. Try again.</a>';

            Andamio.dom.doc.on("ajaxSuccess", function () {

                if (! isOnline) {
                    self.goOnline();
                }
            });

            Andamio.dom.doc.on("ajaxError", self.goOffline);
        }
    };
})();
