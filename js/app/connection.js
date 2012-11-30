/**
 * Module that deals with internet connectivity
 * @author Jeroen Coumans
 * @class connection
 * @namespace APP
 */
APP.connection = (function () {

    // variables
    var connection;

    /**
     * Called when the connection goes online, will hide the offline alert
     * @method goOnline
     * @private
     */
    function goOnline() {

        connection = "online";

        if (APP.alert.status()) {
            APP.alert.hide();
        }
    }

    /**
     * Called when the connection goes offline, will show an offline alert
     * @method goOffline
     * @private
     */
    function goOffline() {

        connection = "offline";

        var offlineText = $('<a href="javascript:void(0)" class="action-refresh">Pagina kon niet geladen worden. Opnieuw laden</a>');
        APP.alert.show(offlineText);
    }

    /**
     * Returns the status of the connection, typically called from APP.open.page() when a timeout occurs
     * @method status
     * @param [msg] {String} accepts `offline` or `online` to set the connection status
     * @return {String} the connection, either `offline` or `online`
     *
     **/
    function status(msg) {

        // useful for testing offline / online
        if (msg === "offline") {
            goOffline();
        } else if (msg === "online") {
            goOnline();
        }

        return connection;
    }

    /***
     * Sets the default connection to online
     * @method init
     */
    function init() {

        // set default connection to online
        goOnline();
    }

    return {
        "init": init,
        "status": status
    };

})();