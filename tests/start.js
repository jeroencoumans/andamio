/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

/***

    This anonymous function initializes Andamio and sets up a dummy pager and slideshow3

***/

window.APP = (function () {

    var activeParentUrl = "",
        pagers = {},
        slideshows = {};

    function updatePager(view) {

        var pagerWrapper = view.content.find(".js-pager-list"),
            viewName     = view.name;

        if (pagerWrapper.length > 0) {

            // Explicitly destroy the pager if it already existed in this view
            if (pagers[viewName]) {

                console.log("deactivate pager " + viewName);
                pagers[viewName].disable();
                pagers[viewName] = null;
            }

            console.log("activate pager " + viewName);

            pagers[viewName] = Andamio.pager.init({
                pagerWrapper:       pagerWrapper,
                autoFetch:          true,
                autoFetchThreshold: 300,
                autoFetchMax:       1,
                pageNumber:         0,
                url:                Andamio.config.server + "pager/",
                queryParam:         false,
                expires:            60,
                callback            : function (pageNumber) {

                    console.log("Pager " + viewName + " " + this.url + pageNumber);
                }
            });
        }
    }

    function updateSlideshows(view) {

        var slideshowEl = view.content.find(".slideshow-wrapper").attr("id"),
            viewName    = view.name,
            options     = {};

        if (slideshowEl) {

            // Explicitly destroy the slideshow if it already existed in this view
            if (slideshows[viewName]) {

                console.log("deactivate slideshow " + viewName);
                slideshows[viewName].destroy();
                slideshows[viewName] = null;
            }

            console.log("activate slideshow " + viewName);

            if (viewName === "childView") options.stopPropagation = true;

            slideshows[viewName] = Andamio.slideshow.init(slideshowEl, options, function (slideNumber) {

                console.log("Slideshow " + viewName + " to " + slideNumber);
            });
        }
    }

    return {
        get pagers() {
            return pagers;
        },

        get slideshows() {
            return slideshows;
        },

        init: function () {

            // Setup listeners for activating pager and slideshow
            Andamio.dom.doc.on("Andamio:views:activateView:finish", function (event, view, loadType, url) {

                // Store the current parent URL so we can skip initialization when we're in the fast path
                if (view.name === "parentView") {
                    if (activeParentUrl === url) {
                        return;
                    }
                    activeParentUrl = url;
                }

                updatePager(view);
                updateSlideshows(view);
            });

            // Initialize
            Andamio.init({
                cache: false,
                title: "Andamio",
                initialView: "blocks/parent.html",
                social: {
                    twitter: "jeroencoumans",
                    facebook: 497899636895210
                }
            });

            Andamio.dom.doc.on("swipeRight", ".action-swipe-nav", function (event) {
                Andamio.nav.show();
            });

            Andamio.dom.doc.on("swipeLeft", ".action-swipe-nav", function (event) {
                Andamio.nav.hide();
            });

            // Setup pull to refresh
            if (Andamio.config.webapp) {
                Andamio.pulltorefresh.init();
            }
        }
    };

})();
