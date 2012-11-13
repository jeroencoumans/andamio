/**
 * Module for using tabs
 */
APP.tabs = (function () {

    // Variables
    var html,
        tabs,
        active;

    function show() {

        html.addClass("has-tabs");
        tabs.show();
    }

    function hide() {

        html.removeClass("has-tabs");
        tabs.hide();
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

            if (target.hasClass("tab-item-active")) {

                return true;
            }

            if (url) {

                // set active class
                active.removeClass("tab-item-active");
                active = target.addClass("tab-item-active");

                APP.open.page(url, APP.views.parentView());
            }
        });
    }

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        html = $("html");
        tabs = $("#page-tabs");
        active = tabs.find(".tab-item-active");

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
