/**
 * Module for page navigation
 */
APP.nav = (function () {

    // Variables
    var parentView,
        pageNav,
        pageNavItems,
        pageNavActive,
        pageNavUrl,
        navigationHeight,
        viewport,
        windowHeight,
        pageContent;


    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** Menu button ***/
        APP.events.attachClickHandler(".action-navigation", function (event) {
            showNavigation();

            if (!$.supports.webapp) {
                toggleHeight();
            }
        });

        /*** Hide menu when it's open ***/
        APP.events.attachClickHandler(".action-hide-navigation", function (event) {
            hideNavigation();

            if (!$.supports.webapp) {
                toggleHeight();
            }
        });

        /*** TODO - page navigation stub ***/
        APP.events.attachClickHandler(".action-nav-item", function (event) {

            var pageNavTarget = $(event.target),
                pageNavUrl = APP.util.getUrl(pageNavTarget),
                pageNavTitle = pageNavTarget.text();

            if (! pageNavUrl) {
                return;
            }

            // set active class
            pageNavActive.removeClass("navigation-item-active");
            pageNavActive = pageNavTarget.addClass("navigation-item-active");

            hideNavigation();

            // set page title
            parentView.find(".action-page-title").text(pageNavTitle);

            APP.core.loadPage(pageNavUrl, parentView)
        });
    };

    /**
     * Sets height of content based on height of navigation
     */
    function toggleHeight() {

        if (windowHeight > navigationHeight) {
            navigationHeight = windowHeight;
            pageNav.height(navigationHeight);
        }

        if (hasNavigation()) {
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
    function showNavigation() {

        html.addClass("has-navigation");
    }

    /**
     * Hides the navigation
     */
    function hideNavigation() {

        html.removeClass("has-navigation");
    }

    /**
     * Returns the status of the navigation
     */
    function hasNavigation() {

        if (html.hasClass("has-navigation")) {
            return true;
        } else {
            return false;
        }
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

        parentView = $("#parent-view");
        pageNav = $("#page-navigation");
        pageNavItems = pageNav.find(".action-nav-item");
        pageNavActive = pageNav.find(".navigation-item-active");

        attachListeners();
    }

    return {
        "init": init,
        "showNavigation": showNavigation,
        "hideNavigation": hideNavigation,
        "hasNavigation": hasNavigation
    };

})();
