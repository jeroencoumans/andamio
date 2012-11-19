/**
 * Module for dealing with modals
 */
APP.modal = (function () {

    // Variables
    var html,
        modal,
        toggle;

    // Export these elements for other modules
    function modalView() { return modal; }

    /**
     * Opens the modal view
     */
    function show() {

        html.addClass("has-modalview");
        toggle.addClass("active");
        APP.views.pageView().addClass("view-hidden");
        modal.removeClass("view-hidden").addClass("active-view");
    }

    /**
     * Hides the modal view
     */
    function hide() {

        html.removeClass("has-modalview");
        toggle.removeClass("active");
        APP.views.pageView().removeClass("view-hidden");
        modal.addClass("view-hidden").removeClass("active-view");
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

        /**
         * Open modal
         * - if data-url is specified, it will be loaded into the modal content
         * - otherwise, if href has a URL, it will be loaded into the modal content
         * - if the action has text, it will be used as the title
         */
        APP.events.attachClickHandler(".action-show-modal", function (event) {

            var target = $(event.target).closest(".action-show-modal"),
                url = APP.util.getUrl(target),
                title = APP.util.getTitle(target);

            show();

            if (url) {
                APP.open.page(url, modal);
            }

            if (title) {
                modal.find(".js-title").text(title);
            }
        });

        /*** Close modal ***/
        APP.events.attachClickHandler(".action-hide-modal", function () {

            hide();
        });
    }

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        html = $("html");
        modal = $("#modal-view");
        toggle = $(".action-show-modal");

        attachListeners();
    }

    return {
        "init": init,
        "modalView": modalView,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
