/**
 * Module for using tabs
 */
APP.localTabs = (function () {

    // Variables
    var html,
        tabs,
        tabItems,
        activeItem,
        tabContent;

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

        APP.events.attachClickHandler(".action-local-tab-item", function (event) {

            var target = $(event.target).closest(".action-local-tab-item"),
                hash = $(event.target.hash);

            if (target === active()) {

                return true;
            }

            if (hash) {

                active(target);
                tabContent.filter(".active").removeClass("active");
                $(hash).addClass("active");
            }

            // don't follow the link
            event.preventDefault();
        });
    }

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        html = $("html");
        tabs = $("#local-tabs");
        tabItems = tabs.find(".action-local-tab-item");
        activeItem = tabs.find(".active");
        tabContent = $(".local-tab-content");

        attachListeners();
    }

    return {
        "init": init,
        "active": active
    };

})();
