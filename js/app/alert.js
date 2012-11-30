/**
 * Controls global alerts
 * @author Jeroen Coumans
 * @class alert
 * @namespace APP
 */
APP.alert = (function () {

    var pageAlert,
        hasAlert;

    /**
     * Show alert
     * @method show
     * @param {String} msg the message of the alert
     */
    function show(msg) {

        if (msg) {
            pageAlert.html(msg);
            pageAlert.show();
            hasAlert = true;
        }
    }

    /**
     * Hide alert
     * @method hide
     */
    function hide() {

        pageAlert.hide();
        hasAlert = false;
    }

    /**
     * Status of alert
     * @method status
     * @return {Boolean} true when alert is displayed, false when alert is hidden
     */
    function status() {

        return hasAlert;
    }

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Calls hide() when .action-hide-alert is clicked
        APP.events.attachClickHandler(".action-hide-alert", function () {

            hide();
        });
    }

    /**
     * Initialize variables and attach listeners
     * @method init
     */
    function init() {

        // assign variables
        pageAlert = $("#page-alert");
        hasAlert = false;

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();