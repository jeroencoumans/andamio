/**
 * Core module for handling events and initializing capabilities
 */
APP.tabs = (function () {

    // Variables
    var html,
        parentView,
        pageTabs,
        pageTabActive;

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** TODO - page tab stub ***/
        APP.events.attachClickHandler(".action-tab-item", function (event) {

            var target = $(event.target).closest(".action-tab-item"),
                title = target.text(),
                url = APP.util.getUrl(target);

            if (url) {
                // set active class
                pageTabActive.removeClass("tab-item-active");
                pageTabActive = target.addClass("tab-item-active");

                APP.views.loadPage(url, parentView);
            }
        });
    }

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

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        html = $("html");
        parentView = $("#parent-view");
        pageTabs = $("#page-tabs");
        pageTabActive = $("#page-tabs .tab-item-active");

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
