/**
 * Module for page navigation
 */
APP.nav = (function () {

    // Variables
    var html,
        pageNav,
        pageNavItems,
        pageNavActive,
        navigationHeight,
        viewport,
        windowHeight,
        pageContent;


    /**
     * Sets height of content based on height of navigation
     */
    function toggleHeight() {

        if (windowHeight > navigationHeight) {
            navigationHeight = windowHeight;
            pageNav.height(navigationHeight);
        }

        if (status()) {
            viewport.height(navigationHeight);
            pageContent.height(navigationHeight);
        } else {
            viewport.height("");
            pageContent.height("");
        }
    }

    /**
     * Shows the navigation
     */
    function show() {

        html.addClass("has-navigation");
    }

    /**
     * Hides the navigation
     */
    function hide() {

        html.removeClass("has-navigation");
    }

    /**
     * Returns the status of the navigation
     */
    function status() {

        return html.hasClass("has-navigation") ? true : false;
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** Menu button ***/
        APP.events.attachClickHandler(".action-navigation", function (event) {
            show();

            if (!$.supports.webapp) {
                toggleHeight();
            }
        });

        /*** Hide menu when it's open ***/
        APP.events.attachClickHandler(".action-hide-navigation", function (event) {
            hide();

            if (!$.supports.webapp) {
                toggleHeight();
            }
        });

        /*** TODO - page navigation stub ***/
        APP.events.attachClickHandler(".action-nav-item", function (event) {

            var target = $(event.target),
                url = APP.util.getUrl(target),
                title = target.text();

            if (url) {
                // set active class
                pageNavActive.removeClass("navigation-item-active");
                pageNavActive = target.addClass("navigation-item-active");

                hide();

                // set page title
                APP.views.parentView().find(".js-title").text(title);

                APP.views.loadPage(url, APP.views.parentView());
            }
        });
    }

    /***
     * Initialize capabilities and attach listeners
     */
    function init() {

        windowHeight = $(window).height();
        navigationHeight = $("#page-navigation").height();

        viewport = $(".viewport");
        pageContent = $(".page-view");
        html = $("html");

        pageNav = $("#page-navigation");
        pageNavItems = pageNav.find(".action-nav-item");
        pageNavActive = pageNav.find(".navigation-item-active");

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
