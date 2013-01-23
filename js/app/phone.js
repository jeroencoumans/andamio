/**
 * Module that enhances the webapp with Cordova functionality
 * @author Jeroen Coumans
 * @class phone
 * @namespace APP
 */
APP.phone = (function () {

    var APP_FROM_BACKGROUND_REFRESH_TIMEOUT = 30 * 60 * 1000,
        lastUpdated = new Date();

    /**
     * Listens to all clicks on anchor tags and opens them in Cordova popover if it's an external URL
     * @method interceptAnchorClicks
     * @private
     */
    function interceptAnchorClicks() {

        APP.dom.viewport.on("click", "a", function() {
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
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // hide splashscreen
        navigator.bootstrap.addConstructor(function() {
            cordova.exec(null, null, "SplashScreen", "hide", []);
        });

        // scroll to top on tapbar tap
        document.addEventListener("statusbartap", function() {

            var pageScroller;

            if (APP.nav.status()) {

                pageScroller = APP.dom.pageNav;
            } else {

                pageScroller = $(".active-view").find(".overthrow");
            }

            pageScroller.each(function() {

                var that = $(this),
                    hasOverflow = that.css("overflow");

                if (hasOverflow === "auto") {
                    $.scrollElement(that.get(0), 0);
                }
            });
        }, false);

        // refresh when application is activated from background
        document.addEventListener("resign", function() {
            lastUpdated = new Date();
        });

        document.addEventListener("active", function() {
            var now = new Date();
            if (now - lastUpdated > APP_FROM_BACKGROUND_REFRESH_TIMEOUT) {

                if (APP.alert.status) APP.alert.hide();
                APP.open.refresh();
            }
        }, false);
    }

    /**
     * Init Cordova stuff. Only called when Cordova is actually loaded
     * @method initCordova
     * @private
     */
    function initCordova() {

        interceptAnchorClicks();
        attachListeners();
    }

    /**
     * Checks wether Cordova is available, and then calls initCordova
     * @method init
     */
    function init() {

        // When Cordovia is loaded and talking to the device, initialize it
        navigator.bootstrap.addConstructor(function() {
            initCordova();
        });
    }

    return {
        "init": init
    };
})();
