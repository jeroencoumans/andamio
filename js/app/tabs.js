/**
 * Module for using tabs
 * @author Jeroen Coumans
 * @class tabs
 * @namespace APP
 */
APP.tabs = (function () {

    // Variables
    var html,
        tabs,
        tabItems,
        activeItem,
        hasTabs;

    function show() {

        html.addClass("has-tabs");
        tabs.show();
        hasTabs = true;
    }

    function hide() {

        html.removeClass("has-tabs");
        tabs.hide();
        hasTabs = false;
    }

    function status() {

        return hasTabs;
    }

    /**
     * Returns the tab items, useful for activating a new tab
     */
    function items() {

        return tabItems;
    }

    /**
     * Returns the active item
     * @elem: set the active item
     */

    function active(elem) {

        if (elem) {

            activeItem.removeClass("active");
            activeItem = elem.addClass("active");
        } else {

            return activeItem;
        }
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-tab-item", function (event) {

            var target = $(event.target).closest(".action-tab-item"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            if (target === active()) {

                return true;
            }

            if (url) {

                active(target);
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
        tabItems = tabs.find(".action-tab-item");
        activeItem = tabs.find(".active");
        hasTabs = html.hasClass("has-tabs") ? true : false;

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status,
        "items": items,
        "active": active
    };

})();
