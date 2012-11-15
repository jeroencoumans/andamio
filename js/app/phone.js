/**
 * Module that enhances the webapp with Cordova functionality
 */
APP.phone = (function () {

    var APP_FROM_BACKGROUND_REFRESH_TIMEOUT = 30 * 60 * 1000,
        lastUpdated = new Date(),
        connection;

    function isOnline(offline) {

        // the Cordova event handlers will set the connection reported by Cordova
        // if Cordova is not available, fall back to HTML5 or default to true
        if (! $.supports.cordova) {

            // check HTML5 property
            connection = window.navigator.onLine;
        } else if ("offline") {

            // Useful for testing in offline mode
            connection = false;
        } else {

            // By default, we assume an internet connection is present
            connection = true;
        }

        return connection;
    }

    /**
     * Intercepts all clicks on anchor tags
     */
    function interceptAnchorClicks() {

        $(document.body).on("click", "a", function(event) {
            if ($.supports.cordova && APP.util.isExternalLink(this)) {

                // open external URL's in in-app Cordova browser
                var href = $(this).attr("href");
                navigator.utility.openUrl(href, "browser");
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
        });

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

        // Support for online/offline mode
        document.addEventListener("online", function() {

            connection = false;
        }, false);

        document.addEventListener("online", function() {

            connection = true;
        }, false);
    }

    function init() {

        interceptAnchorClicks();
        // make sure to only attach the listners when Cordovia is ready
        document.addEventListener("deviceready", attachListeners(), false);
    }

    return {
        "init": init,
        "isOnline": isOnline
    };
})();