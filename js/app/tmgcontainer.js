/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $, cordova */

Andamio.tmgcontainer = (function () {

    var scroller, now;

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
                Andamio.events.attach('.action-external', function (event) {

                    var target  = $(event.currentTarget),
                        href = target.attr("href");

                    navigator.utility.openUrl(href, "popover");
                    return false;
                });

                Andamio.dom.doc.on("statusbartap", function () {

                    scroller = Andamio.nav.status ? Andamio.dom.pageNav : Andamio.views.currentView.scroller;

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

                    now = new Date();

                    if (now - Andamio.config.phone.updateTimestamp > Andamio.config.phone.updateTimeout) {

                        if (Andamio.alert.status) {
                            Andamio.alert.hide();
                        }

                        if (Andamio.views.currentView === Andamio.views.parentView) {
                            Andamio.views.refreshView();
                        }
                    }
                });
            });
        }
    };
})();
