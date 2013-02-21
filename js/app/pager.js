/*jshint es5: true, browser: true */
/*global Andamio, $ */

Andamio.pager = (function () {

    var active,
        pageNumber,
        isLoading,
        currentView,
        currentScroller,
        currentScrollerHeight,
        currentScrollerScrollHeight;

    function enable() {

        active = true;

        if (Andamio.config.pagerAutoFetch) {
            currentScroller.on("scroll", onScroll);
        }
    }

    function disable() {

        active = false;

        if (Andamio.config.pagerAutoFetch) {
            currentScroller.off("scroll", onScroll);
        }
    }

    function reset(elem) {

        pageNumber = 1;
        isLoading = false;
        currentView = Andamio.views.list.lookup(Andamio.views.currentView);
        currentScroller = currentView.scroller;
        currentScrollerHeight = currentScroller.height();
        currentScrollerScrollHeight = currentScroller[0].scrollHeight || Andamio.dom.viewport.height();

        // public
        Andamio.dom.pagerWrapper = elem || currentView.content.find(".js-pager-list");
    }

    function loadNextPage() {

        if (! isLoading) {

            isLoading = true;
            ++pageNumber;

            Andamio.page.load(Andamio.config.pagerUrl + pageNumber, null, function(response) {

                if (response) {
                    Andamio.dom.pagerWrapper.append(response);

                    isLoading = false;
                    currentScrollerHeight = currentScroller.height();
                    currentScrollerScrollHeight = currentScroller[0].scrollHeight || Andamio.dom.viewport.height();
                } else {
                    disable();
                }
            });
        }
    }

    function onScroll() {

        if (! isLoading) {

            var scrollTop = currentScroller.scrollTop();

            if (scrollTop + currentScrollerHeight + Andamio.config.pagerAutoFetchThreshold >= currentScrollerScrollHeight) {
                loadNextPage();
            }
        }
    }

    return {

        get status() {
            return active;
        },

        set status(value) {
            if (value) {
                enable();
            } else {
                disable();
            }
        },

        init: function(elem, url, autoFetch) {

            Andamio.config.pagerAutoFetch = autoFetch;
            Andamio.config.pagerAutoFetchThreshold = 100;
            Andamio.config.pagerUrl = url;

            reset(elem);

            this.status = Andamio.dom.pagerWrapper.length > 0;
        },
    };

})();
