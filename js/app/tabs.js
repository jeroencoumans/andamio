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

    var hasTabs;

    return {

        show: function() {
            hasTabs = true;
            Andamio.dom.html.addClass("has-page-tabs");
            Andamio.dom.pageTabs.show();
        },

        hide: function() {
            hasTabs = false;
            Andamio.dom.html.removeClass("has-page-tabs");
            Andamio.dom.pageTabs.hide();
        },

        get status() {
            return hasTabs;
        },

        init: function() {
            var self = this;

            hasTabs = Andamio.dom.html.hasClass("has-page-tabs");

            Andamio.events.attach(".action-tab-item", function (event) {

                var target  = $(event.currentTarget),
                    url     = Andamio.util.getUrl(target),
                    title   = Andamio.util.getTitle(target);

                Andamio.dom.pageTabsActive = target;

                if (title) {
                    Andamio.dom.viewport.one("Andamio:views:activateView:finish", function() {
                        Andamio.views.list.values.parentView.title = title;
                    });
                }

                Andamio.views.openParentPage(url);
            });

            Andamio.events.attach(".action-show-tabs", Andamio.tabs.show);
            Andamio.events.attach(".action-hide-tabs", Andamio.tabs.hide);
        }
    };
})();
