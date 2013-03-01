/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.connection = (function () {

    var isOnline;

    return {

        goOnline: function () {
            isOnline = true;
            Andamio.alert.hide();
        },

        goOffline: function () {

            if (!!isOnline) {
                isOnline = false;

                var offlineMessage = $('<a href="javascript:void(0)" class="action-refresh">' + Andamio.i18n.offlineMessage + '</a>');
                Andamio.alert.show(offlineMessage);
            }
        },

        get status() {
            return isOnline;
        },

        init: function () {

            isOnline = navigator.onLine;
        }
    };

})();
