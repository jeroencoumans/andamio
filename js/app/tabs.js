/**
 * Core module for handling events and initializing capabilities
 */
APP.tabs = (function () {

    // Variables
    var parentView,
        pageTabActive;

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** TODO - page tab stub ***/
        APP.events.attachClickHandler(".action-tab-item", function (event) {

            var target = $(event.target),
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

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        parentView = $("#parent-view");
        pageTabActive = $("#page-tabs .tab-item-active");

        attachListeners();
    }

    return {
        "init": init
    };

})();
