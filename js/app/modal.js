/**
 * Module for dealing with modals
 * @author Jeroen Coumans
 * @class modal
 * @namespace APP
 */
APP.modal = (function () {

    // Variables
    var hasModalview;

    /**
     * Opens the modal view
     * @method show
     */
    function show() {

        if (APP.alert.status) APP.alert.hide();

        APP.dom.html.addClass("has-modalview");
        APP.dom.pageView.addClass("view-hidden");
        APP.dom.modalView.removeClass("view-hidden");
        APP.dom.modalView.addClass("active-view");
        hasModalview = true;
    }

    /**
     * Hides the modal view
     * @method hide
     */
    function hide() {

        APP.dom.html.removeClass("has-modalview");
        APP.dom.pageView.removeClass("view-hidden");
        APP.dom.modalView.addClass("view-hidden");
        APP.dom.modalView.removeClass("active-view");
        hasModalview = false;
    }

    /**
     * Returns the status of the modal view
     * @method status
     * @return {Boolean} wether modal view is shown or not
     */
    function status() {

        return hasModalview;
    }

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        /*
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
                APP.open.page(url, APP.dom.modalView);
            }

            if (title) {
                APP.dom.modalView.find(".js-title").text(title);
            }
        });

        /*
         * Close modal
         */
        APP.events.attachClickHandler(".action-hide-modal", function () {

            hide();
        });
    }

    /**
     * Initialize variables and attach listeners
     * @method init
     */
    function init() {

        hasModalview = APP.dom.html.hasClass("has-modalview") ? true : false;

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
