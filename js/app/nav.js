/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

Andamio.dom.pageNav = $(".js-page-navigation");
Andamio.dom.pageNavItems = Andamio.dom.pageNav.find(".action-nav-item");

Object.defineProperties(Andamio.dom, {
    pageNavActive: {

        get: function () {

            return this.pageNavItems.filter(".active");
        },

        set: function (elem) {

            if ($.contains(this.pageNav[0], elem[0])) {
                this.pageNavActive.removeClass("active");
                elem.addClass("active");
            }
        }
    }
});

Andamio.nav = (function () {

    var isActive,
        docheight,
        navheight;

    function setPageHeight(height) {

        Andamio.dom.viewport.height(height);
        Andamio.dom.pageView.height(height);
    }

    return {

        show: function () {
            isActive = true;
            Andamio.events.lock();
            Andamio.dom.html.addClass("has-navigation");

            if (!Andamio.config.webapp) {
                setPageHeight(navheight);
            }
        },

        hide: function () {
            isActive = false;
            Andamio.events.lock();
            Andamio.dom.html.removeClass("has-navigation");

            if (!Andamio.config.webapp) {
                setPageHeight("");
            }
        },

        get status() {
            return isActive;
        },

        init: function () {
            var self = this;

            isActive = Andamio.dom.html.hasClass("has-navigation");

            if (!Andamio.config.webapp) {
                docheight = Andamio.dom.win.height();
                navheight = Andamio.dom.pageNav.height();

                // When in Mobile Safari, add the height of the address bar
                if (Andamio.config.os.iphone) {
                    docheight += 60;
                }

                // make sure the navigation is as high as the page
                if (docheight > navheight) {
                    navheight = docheight;
                    Andamio.dom.pageNav.height(navheight);
                }
            }

            Andamio.events.attach(".action-show-nav", self.show);
            Andamio.events.attach(".action-hide-nav", self.hide);

            Andamio.events.attach(".action-nav-item", function (event) {

                var target  = $(event.currentTarget),
                    url     = Andamio.util.getUrl(target),
                    title   = Andamio.util.getTitle(target);

                if (Andamio.dom.pageNavActive[0] === target[0] && !Andamio.config.os.tablet) {
                    self.hide();
                    return;
                }

                Andamio.dom.pageNavActive = target;

                if (!Andamio.config.os.tablet) {
                    self.hide();
                }

                if (title) {
                    Andamio.dom.doc.one("Andamio:views:activateView:finish", function () {
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
