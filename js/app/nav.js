/*jshint es5: true, browser: true */
/*global $, Andamio */

Andamio.dom.pageNav = $(".js-page-navigation");
Andamio.dom.pageNavItems = Andamio.dom.pageNav.find(".action-nav-item");

Object.defineProperties(Andamio.dom, {
    pageNavActive: {

        get: function() {

            return this.pageNavItems.filter(".active");
        },

        set: function(elem) {

            var current = this.pageNavActive;

            // TODO: check wether elem is present in pageNavItems
            current.removeClass("active");
            elem.addClass("active");
        }
    }
});

Andamio.nav = (function () {

    "use strict";

    var docheight,
        navheight;

    function setPageHeight(height) {

        Andamio.dom.viewport.height(height);
        Andamio.dom.pageView.height(height);
    }

    return {

        show: function() {
            Andamio.dom.html.addClass("has-navigation");

            if (!Andamio.config.webapp) {
                setPageHeight(navheight);
            }
        },

        hide: function() {
            Andamio.dom.html.removeClass("has-navigation");

            if (!Andamio.config.webapp) {
                setPageHeight("");
            }
        },

        get status() {
            return Andamio.dom.html.hasClass("has-navigation");
        },

        set status(Boolean) {
            if (Boolean) this.show();
            else this.hide();
        },

        init: function() {
            var self = this;

            self.status = Andamio.dom.html.hasClass("has-navigation");

            docheight = Andamio.dom.doc.height();
            navheight = Andamio.dom.pageNav.height();

            // make sure the navigation is as high as the page
            if (docheight > navheight) {
                navheight = docheight;
                Andamio.dom.pageNav.height(navheight);
            }

            Andamio.events.attach(".action-show-nav", self.show);
            Andamio.events.attach(".action-hide-nav", self.hide);

            Andamio.events.attach(".action-nav-item", function (event) {

                var target  = $(event.currentTarget),
                    url     = Andamio.util.getUrl(target),
                    title   = Andamio.util.getTitle(target);

                Andamio.dom.pageNavActive = target;

                if (!Andamio.config.tablet) {
                    self.hide();
                }

                if (title) {
                    Andamio.dom.viewport.one("Andamio:views:activateView:finish", function() {
                        Andamio.views.list.lookup("parentView").title = title;
                    });
                }

                if (url) {
                    Andamio.views.openParentPage(url);
                }
            });
        }
    };
})();
