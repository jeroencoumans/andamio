/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

// Register DOM references
Andamio.dom.pageTabs = $(".js-page-tabs");
Andamio.dom.pageTabsItems = Andamio.dom.pageTabs.find(".action-tab-item");

Object.defineProperties(Andamio.dom, {
    pageTabsActive: {

        get: function () {

            return this.pageTabsItems.filter(".active");
        },

        set: function (elem) {

            if ($.contains(this.pageTabs[0], elem[0])) {
                this.pageTabsActive.removeClass("active");
                elem.addClass("active");
            }
        }
    }
});

Andamio.tabs = (function () {

    var hasTabs;

    return {

        show: function () {
            hasTabs = true;
            Andamio.dom.html.addClass("has-page-tabs");
        },

        hide: function () {
            hasTabs = false;
            Andamio.dom.html.removeClass("has-page-tabs");
        },

        get status() {
            return hasTabs;
        },

        init: function () {

            // Setup initial state
            hasTabs = Andamio.dom.html.hasClass("has-page-tabs");

            // Register event handlers
            Andamio.events.attach(".action-show-tabs", Andamio.tabs.show);
            Andamio.events.attach(".action-hide-tabs", Andamio.tabs.hide);

            Andamio.events.attach(".action-tab-item", function (event) {

                var target  = $(event.currentTarget),
                    url     = Andamio.util.getUrl(target),
                    title   = Andamio.util.getTitle(target);

                // We open the tab's URL if it's not the same as the current URL as a shortcut for the user
                if (Andamio.views.currentUrl !== url) {

                    Andamio.dom.pageTabsActive = target;

                    if (title) {
                        Andamio.views.parentView.title = title;
                    }

                    Andamio.views.openParentPage(url);
                }
            });
        }
    };
})();
