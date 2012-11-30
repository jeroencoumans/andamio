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

    /**
     * Shows the tabs
     * @method show
     */
    function show() {

        html.addClass("has-tabs");
        tabs.show();
        hasTabs = true;
    }

    /**
     * Hides the tabs
     * @method hide
     */
    function hide() {

        html.removeClass("has-tabs");
        tabs.hide();
        hasTabs = false;
    }

    /**
     * Wether the tabs are shown or not
     * @method status
     * @return {Boolean} true when shown, false when hidden
     */
    function status() {

        return hasTabs;
    }

    /**
     * Returns the tab items, useful for activating a new tab
     * @method items
     * @return {Object} returns an object that contains all .action-tab-item elements
     */
    function items() {

        return tabItems;
    }

    /**
     * Sets or returns the active tab item. NOTE: this only sets the `active` class on the tab item!
     *
     * @method active
     * @param {HTMLElement} [elem] set the active tab item
     * @return {HTMLElement} the active tab item
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
     * @method attachListeners
     * @private
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
     * @method init
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
