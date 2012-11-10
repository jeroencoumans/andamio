/**
 * Core module for handling events and initializing capabilities
 */
APP.modal = (function () {

    // Variables
    var html,
        modalView;

    /**
     * Opens the modal view
     */
    function show() {

        html.addClass("has-modalview");
        APP.views.pageView().addClass("view-hidden");
        modalView.removeClass("view-hidden");
    }

    /**
     * Hides the modal view
     */
    function hide() {

        html.removeClass("has-modalview");
        APP.views.pageView().removeClass("view-hidden");
        modalView.addClass("view-hidden");
    }

    /**
     * Returns the status of the modal view
     */
    function status() {

        return html.hasClass("has-modalview") ? true : false;
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** TODO - modal stub ***/
        APP.events.attachClickHandler(".action-open-modal", function (event) {

            show();
        });

        /*** TODO - modal stub ***/
        APP.events.attachClickHandler(".action-close-modal", function (event) {

            hide();
        });
    }

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        loader = $("#loader");
        html = $("html");
        modalView = $("#modal-view");

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
