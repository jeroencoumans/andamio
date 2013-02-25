/*jshint es5: true, browser: true, undef:true, unused:true, strict:true */
/*global Andamio, $, cordova */

Andamio.phone = (function () {

    "use strict";

    return {
        init: function () {

            Andamio.config.phone = {
                updateTimestamp: new Date(),
                updateTimeout: 30 * 60 * 1000
            };

            navigator.bootstrap.addConstructor(function () {

                // hide splashscreen
                cordova.exec(null, null, "SplashScreen", "hide", []);

                // Listens to all clicks on anchor tags and opens them in Cordova popover if it's an external URL
                Andamio.events.attach('a[target="_blank"]', function (event) {

                    var target  = $(event.currentTarget),
                        href = target.attr("href");

                    navigator.utility.openUrl(href, "popover");
                    return false;
                });

                Andamio.dom.doc.on("statusbartap", function () {

                    var currentView = Andamio.views.list.lookup(Andamio.views.currentView),
                        scroller = Andamio.nav.status ? Andamio.dom.pageNav : currentView.scroller;

                    if ($.scrollTo) {
                        scroller.scrollTo(0, 400);
                    } else if ($.scrollElement) {
                        $.scrollElement(scroller[0], 0);
                    }
                });

                // refresh when application is activated from background
                Andamio.dom.doc.on("resign", function () {
                    Andamio.config.phone.updateTimestamp = new Date();
                });

                Andamio.dom.doc.on("active", function () {
                    var now = new Date();
                    if (now - Andamio.config.updateTimestamp > Andamio.config.updateTimeout) {

                        if (Andamio.alert.status) {
                            Andamio.alert.hide();
                        }

                        Andamio.views.refreshView();
                    }
                });

            });
        }
    };
})();
