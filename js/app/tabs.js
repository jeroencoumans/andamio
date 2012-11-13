/**
 * Module for using tabs
 */
APP.tabs = (function () {

    // Variables
    var html,
        pageTabs,
        pageTabActive;

    function show() {

        html.addClass("has-tabs");
        pageTabs.show();
    }

    function hide() {

        html.removeClass("has-tabs");
        pageTabs.hide();
    }

    function status() {

        return html.hasClass("has-tabs") ? true : false;
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-tab-item", function (event) {

            var target = $(event.target).closest(".action-tab-item"),
                title = target.text(),
                url = APP.util.getUrl(target);

            if (url) {
                // set active class
                pageTabActive.removeClass("tab-item-active");
                pageTabActive = target.addClass("tab-item-active");

                APP.open.page(url, APP.views.parentView());
            }
        });
    }

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        html = $("html");
        pageTabs = $("#page-tabs");
        pageTabActive = pageTabs.find(".tab-item-active");

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
