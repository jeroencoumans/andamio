/**
 * Module that enhances the webapp with Cordova functionality
 */
APP.phone = (function () {

    var APP_FROM_BACKGROUND_REFRESH_TIMEOUT = 30 * 60 * 1000,
        lastUpdated = new Date();

    /**
     * Intercepts all clicks on anchor tags
     */
    function interceptAnchorClicks() {

        $(document.body).on("click", "a", function() {
            if (APP.util.isExternalLink(this)) {

                // open external URL's in in-app Cordova browser
                var href = $(this).attr("href");
                navigator.utility.openUrl(href, "popover");
                return false;
            } else {
                return true;
            }
        });
    }

    /**
     * Attach Cordova listeners
     */
    function attachListeners() {

        // hide splashscreen
        navigator.bootstrap.addConstructor(function() {
            cordova.exec(null, null, "SplashScreen", "hide", []);
        });

        // scroll to top on tapbar tap
        document.addEventListener("statusbartap", function() {

            var pageScroller = $(".active-view .overthrow");
            $.scrollElement(pageScroller.get(0), 0);
        }, false);

        // refresh when application is activated from background
        document.addEventListener("resign", function() {
            lastUpdated = new Date();
        });

        document.addEventListener("active", function() {
            var now = new Date();
            if (now - lastUpdated > APP_FROM_BACKGROUND_REFRESH_TIMEOUT) {
                APP.open.refresh();
            }
        }, false);
    }

    /**
     * Init Cordova stuff. Only called when Cordova is actually loaded
     */
    function initCordova() {

        interceptAnchorClicks();
        attachListeners();
    }

    function init() {

        // When Cordovia is loaded and talking to the device, initialize it
        document.addEventListener("deviceready", initCordova(), false);
    }

    return {
        "init": init
    };
})();