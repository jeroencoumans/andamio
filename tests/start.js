/***

    This anonymous function initializes Andamio and sets up a dummy pager and slideshow

***/

window.APP = (function () {

    var pagers = {},
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
                autoFetchMax:       2,
                pageNumber:         0,
                url:                Andamio.config.server + "pager/",
                expires:            60,
                callback            : function (pageNumber) {

                    console.log("Pager " + viewName + " " + this.url + pageNumber);
                }
            });
        }
    }

    function updateSlideshows(view) {

        var slideshowEl = view.content.find(".slideshow-wrapper").attr("id"),
            viewName    = view.name;

        if (slideshowEl) {

            // Explicitly destroy the slideshow if it already existed in this view
            if (slideshows[viewName]) {

                console.log("deactivate slideshow " + viewName);
                slideshows[viewName].destroy();
                slideshows[viewName] = null;
            }

            console.log("activate slideshow " + viewName);
            slideshows[viewName] = Andamio.slideshow.init(slideshowEl, null, function (slideNumber) {

                console.log("Slideshow " + viewName + " to " + slideNumber);
            });
        }
    }

    return {
        init: function () {

            // Setup listeners for activating pager and slideshow
            Andamio.dom.doc.on("Andamio:views:activateView:finish", function (event, view, loadType, url) {

                updatePager(view);
                updateSlideshows(view);
            });

            // Initialize
            Andamio.init({
                title: "Andamio",
                initialView: "blocks/parent.html",
                social: {
                    twitter: "jeroencoumans",
                    facebook: 497899636895210
                }
            });

            // Setup pull to refresh
            if (Andamio.config.webapp) {
                Andamio.pulltorefresh.init();
            }
        }
    }

})();