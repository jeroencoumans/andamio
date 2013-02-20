/*jshint es5: true, browser: true */
/*global $, Andamio */

Andamio.dom.pageTabs = $(".js-page-tabs");
Andamio.dom.pageTabsItems = Andamio.dom.pageTabs.find(".action-tab-item");

Object.defineProperties(Andamio.dom, {
    pageTabsActive: {

        get: function() {

            return this.pageTabsItems.filter(".active");
        },

        set: function(elem) {

            var current = this.pageTabsActive;

            // TODO: check wether elem is present in pageTabsItems
            current.removeClass("active");
            elem.addClass("active");
        }
    }
});

Andamio.tabs = (function () {

    "use strict";

    return {

        show: function() {
            Andamio.dom.html.addClass("has-page-tabs");
            Andamio.dom.pageTabs.show();
        },

        hide: function() {
            Andamio.dom.html.removeClass("has-page-tabs");
            Andamio.dom.pageTabs.hide();
        },

        get status() {
            return Andamio.dom.html.hasClass("has-page-tabs");
        },

        set status(Boolean) {
            if (Boolean) this.show();
            else this.hide();
        },

        init: function() {
            var self = this;

            self.status = Andamio.dom.html.hasClass("has-page-tabs");

            Andamio.events.attach(".action-tab-item", function (event) {

                var target  = $(event.currentTarget),
                    url     = Andamio.util.getUrl(target),
                    title   = Andamio.util.getTitle(target);

                Andamio.dom.pageTabsActive = target;

                if (title) {
                    Andamio.dom.viewport.one("Andamio:views:activateView:finish", function() {
                        var currentView = Andamio.views.list.lookup(Andamio.views.currentView);
                        currentView.title = title;
                    });
                }

                if (url) {
                    Andamio.views.activateView(Andamio.views.currentView, url, null, 0);
                    Andamio.views.currentUrl = url;
                }
            });

            Andamio.events.attach(".action-show-tabs", Andamio.tabs.show);
            Andamio.events.attach(".action-hide-tabs", Andamio.tabs.hide);
        }
    };
})();
