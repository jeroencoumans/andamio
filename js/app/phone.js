/*jshint latedef:true, undef:true, unused:true, boss:true */
/*global APP, $, navigator, cordova */

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
     * Attach Cordova listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Listens to all clicks on anchor tags and opens them in Cordova popover if it's an external URL
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

        // hide splashscreen
        navigator.bootstrap.addConstructor(function() {
            cordova.exec(null, null, "SplashScreen", "hide", []);
        });

        // scroll to top on tapbar tap
        APP.dom.doc.on("statusbartap", function() {

            var pageScroller = APP.nav.status() ? APP.dom.pageNav : APP.views.current().content;
            $.scrollElement(pageScroller[0], 0);

        });

        // refresh when application is activated from background
        APP.dom.doc.on("resign", function() {
            lastUpdated = new Date();
        });

        APP.dom.doc.on("active", function() {
            var now = new Date();
            if (now - lastUpdated > APP_FROM_BACKGROUND_REFRESH_TIMEOUT) {

                if (APP.alert.status) APP.alert.hide();
                APP.views.reloadPage();
            }
        });
    }

    /**
     * Checks wether Cordova is available, and then calls initCordova
     * @method init
     */
    function init() {

        // When Cordovia is loaded and talking to the device, initialize it
        navigator.bootstrap.addConstructor(function() {

            attachListeners();
        });
    }

    return {
        "init": init
    };
})();
