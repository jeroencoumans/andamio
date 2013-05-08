/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.container = (function () {

    function initContainer() {

        Andamio.config.phone = {
            updateTimestamp: new Date(),
            updateTimeout: (typeof Andamio.config.parentCacheExpiration === "number") ? Andamio.config.parentCacheExpiration * 1000 : 0
        };

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

        Andamio.dom.doc.on("pause", function () {
            Andamio.config.phone.updateTimestamp = new Date();
        });

        Andamio.dom.doc.on("resume", function () {

            var now = new Date();

            // Refresh parentView if longer than updateTimeout has passed
            if (now - Andamio.config.phone.updateTimestamp > Andamio.config.phone.updateTimeout) {
                Andamio.views.refreshView(Andamio.views.parentView);
            }
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
