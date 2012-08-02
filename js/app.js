var APP = APP || {};

/**
 * Core module for handling events and initializing capabilities
 */
APP.core = (function() {

    var loader,
        html;

    /***
     * Initialize capabilities and attach listeners
     */
    function init() {

        loader = $("#loader");
        html = $("html");

        initCapabilities();

        // When used as standalone app or springboard app
        if ($.supports.webapp) {
            html.removeClass("website");
            html.addClass("webapp");
        }

        APP.events.init();

        attachListeners();
        attachGlobalListeners();
    }

    function initCapabilities() {

        $.supports = $.supports || {};

        // basic ios5 detection
        $.os.ios5 = $.os.ios && $.os.version.indexOf("5.") != -1;
        $.os.ios6 = $.os.ios && $.os.version.indexOf("6.") != -1;

        // Uncomment to test iOS5 mode
        // $.os.ios5 = true;

        $.supports.cordova = APP.util.getQueryParam("cordova") === "1";
        $.supports.webapp = navigator.standalone || $.supports.cordova;


        // Uncomment to test standalone mode
        // $.supports.webapp = true;
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-navigation-toggle", function(event) {
            toggleNavigation();

            if (! $supports.webapp) {
                toggleNavigationHeight();
            }

            event.preventDefault();

            return false;
        });

    }

    /**
     * Attach event listeners for global (application) events
     */
     function attachGlobalListeners() {

     }

    /**
     * Sets height of content based on height of navigation
     */
     function toggleNavigationHeight() {

        navigationHeight = $("#page-navigation").height();
        viewportHeight = $(window).height();
        wrapper = $("#page-wrapper");
        content = $(".page-content");

        if (html.hasClass("has-navigation") && navigationHeight > viewportHeight) {
            wrapper.height(navigationHeight);
            content.height(navigationHeight);
        } else {
            wrapper.height("");
            content.height("");
        }
     }

    /**
     * Shows or hides the navigation menu
     */
    function toggleNavigation() {

        html.toggleClass("has-navigation");
    }

    /**
     * Hides the navigation menu
     */
     function hideNavigation() {

        html.removeClass("has-navigation");
     }

    /**
     * Shows the loader in an overlay
     */
    function showLoader() {

        loader.show();
    }

    /**
     * Hides the loader
     */
    function hideLoader() {

        loader.hide();
    }

    return {
        "init": init,
        "showLoader": showLoader,
        "hideLoader": hideLoader,
        "hideNavigation": hideNavigation
    };

})();


APP.util = (function() {

    /**
     * Returns the value for a given query string key.
     * @todo It would be better to parse the query string once and cache the result.
     *
     * @param name Query string key
     * @param defaultValue If the query string is not found it returns this value.
     * @param queryString Query string to pick the value from, if none is provided
     *                    window.location.search query string will be used. This
     *                    parameter makes the function testable.
     *
     * @return The value of the query string or defaultValue if the key is
     *         not found. If the value is empty an empty string is returned.
     */
    function getQueryParam(name, defaultValue, queryString) {

        if (!queryString) {
            queryString = window.location.search;
        }
        var match = RegExp("[?&]" + name + "=([^&]*)").exec(queryString);

        return match ?
            decodeURIComponent(match[1].replace(/\+/g, " "))
            : defaultValue;
    }

    return {
        "getQueryParam": getQueryParam
    };
})();
