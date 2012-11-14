/**
 * Wrapper for doing an AJAX request
 */
APP.alert = (function () {

    // variables
    var alert,
        hasAlert;

    /**
     * Show alert
     * @param type of the alert (error, success, info)
     * @param text of the alert
     */
    function show(text) {

        if (text) {
            alert.html(text);
            alert.show();
            hasAlert = true;
        }
    }

    /**
     * Hide alert
     */
    function hide() {

        alert.hide();
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
        alert = $("#page-alert");
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