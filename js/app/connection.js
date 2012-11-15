/**
 * Module that deals with internet connectivity
 */
APP.connection = (function () {

    // variables
    var connection;

    // called when the connection goes online
    function goOnline() {

        connection = "online";

        if (APP.alert.status()) {
            APP.alert.hide();
        }
    }

    // called when the connection goes offline
    function goOffline() {

        connection = "offline";

        var offlineText = $('<a href="javascript:void(0)" class="action-refresh">Pagina kon niet geladen worden. Opnieuw laden</a>');
        APP.alert.show(offlineText);
    }

    /**
     * returns the status of the connection
     * @param msg string: pass either "offline" or "online" to set the connection status
     * typically called from APP.open.page() when a timeout occurs
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
     * Initialize variables and attach listeners
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