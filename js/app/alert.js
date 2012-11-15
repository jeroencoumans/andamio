/**
 * Wrapper for doing an AJAX request
 */
APP.alert = (function () {

    // variables
    var pageAlert,
        hasAlert;

    /**
     * Show alert
     * @param type of the alert (error, success, info)
     * @param msg of the alert
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
     */
    function hide() {

        pageAlert.hide();
        hasAlert = false;
    }

    /**
     * Status of alert
     */
    function status() {

        return hasAlert;
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** Close alert ***/
        APP.events.attachClickHandler(".action-hide-alert", function (event) {

            hide();
        });
    }

    /***
     * Initialize variables and attach listeners
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