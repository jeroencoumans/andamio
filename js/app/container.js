/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.container = (function () {

    function initContainer() {

        var parentUrls = [],
            updateTimestamp = new Date(),
            updateTimeout = Andamio.config.parentCacheExpiration || 0;

        // hide splashscreen
        if (navigator.splashscreen) navigator.splashscreen.hide();

        // Listens to all clicks on anchor tags and opens them in Cordova popover if it's an external URL
        Andamio.events.attach('.action-external', function (event) {

            var target  = $(event.currentTarget),
                href = target.attr("href");

            if (navigator.utility && navigator.utility.openUrl) {
                navigator.utility.openUrl(href, "popover");
            }
        });

        Andamio.dom.doc.on("statusbartap", function () {

            var scroller = Andamio.nav.status ? Andamio.dom.pageNav : Andamio.views.currentView.scroller;

            if ($.scrollTo) {
                scroller.scrollTo(0, 400);
            } else if ($.scrollElement) {
                $.scrollElement(scroller[0], 0);
            }
        });

        // Store all parentView URL's so we can remove their cache when resuming
        Andamio.dom.doc.on("Andamio:views:activateView:finish", function (event, view, loadType, url) {

            Andamio.util.addOnly(url, parentUrls);
        });

        Andamio.dom.doc.on("pause", function () {
            Andamio.config.phone.updateTimestamp = new Date();
        });

        Andamio.dom.doc.on("resume", function () {

            var now = new Date();

            if (now - updateTimestamp < updateTimeout) return;

            // Refresh current view if longer than updateTimeout has passed
            if (Andamio.views.currentView === Andamio.views.parentView) {
                Andamio.views.refreshView();
            }

            // Remove all cached parentPages when resuming
            $(parentUrls).each(function (index, item) {
                Andamio.cache.remove(item);
                parentUrls.shift();
            });

        });
    }

    return {

        init: function () {

            if (navigator.bootstrap) {
                navigator.bootstrap.addConstructor(initContainer);
            } else {
                Andamio.dom.doc.on("deviceready", initContainer);
            }
        }
    };
})();
