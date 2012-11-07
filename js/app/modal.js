/**
 * Core module for handling events and initializing capabilities
 */
APP.modal = (function () {

    // Variables
    var html,
        pageView,
        childView,
        modalView;

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** TODO - modal stub ***/
        APP.events.attachClickHandler(".action-modal", function (event) {

            openModal();
        });

        /*** TODO - modal stub ***/
        APP.events.attachClickHandler(".action-close-modal", function (event) {

            closeModal();
        });
    }

    /**
     * Opens the modal view
     */
    function openModal() {

        html.addClass("has-modalview");
        pageView.addClass("view-hidden");
        modalView.removeClass("view-hidden");
    }

    /**
     * Hides the modal view
     */
    function closeModal() {

        html.removeClass("has-modalview");
        pageView.removeClass("view-hidden");
        modalView.addClass("view-hidden");
    }

    /**
     * Returns the status of the modal view
     */
    function hasModal() {

        return html.hasClass("has-modalview") ? true : false;
    }

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        loader = $("#loader");
        html = $("html");
        pageView = $("#page-view");
        modalView = $("#modal-view")

        attachListeners();
    }

    return {
        "init": init,
        "openModal": openModal,
        "closeModal": closeModal,
        "hasModal": hasModal
    };

})();
