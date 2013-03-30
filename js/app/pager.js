/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

/**

    Setup a pager in the current view. The following initialization options are available:

    var myPager = Andamio.pager.init({
        autoFetch           : true, // boolean, wether to automatically download new pages when scrolling to the bottom
        autoFetchMax        : 3,    // number of pages to fetch automatically, afterwards a button is available
        autoFetchThreshold  : 100,  // pixels from the bottom before autoFetch is triggered
        callback            : function () {} // function that is executed after a page has succesfully loaded
        expires             : null, // minutes to save the pages in cache (if available)
        itemsPerPage        : 10, // the amount of items that are except per page, used to detect when to disable the pager
        pageNumber          : 0, // starting page number
        pagerWrapper        : Andamio.views.currentView.content.find(".js-pager-list"), // pager wrapper
        url                 : Andamio.config.server + "?page=" // URL that should be loaded. The pageNumber is automatically appended
    })

 **/

Andamio.pager = (function () {

    function Pager(params) {

        // Setup defaults
        this.options = {
            autoFetch           : true,
            autoFetchMax        : 3,
            autoFetchThreshold  : 100,
            callback            : function () {},
            expires             : null,
            itemsPerPage        : 10,
            pageNumber          : 0,
            pagerWrapper        : Andamio.views.currentView.content.find(".js-pager-list"),
            url                 : Andamio.config.server + "?page="
        };

        // Private variables
        var loadMoreAction = $('<div class="pager-action"><a href="javascript:void(0)" class="button button-block action-load-more">' + Andamio.i18n.pagerLoadMore + '</a></div>'),
            spinner        = $('<div class="pager-loading">' + Andamio.i18n.pagerLoading + '</div></div>'),
            noMorePages    = $('<div class="pager-action">' + Andamio.i18n.pagerNoMorePages + '</div>'),
            scroller       = Andamio.views.currentView.scroller,
            scrollerHeight = scroller.height(),
            scrollerScrollHeight = scroller[0].scrollHeight || Andamio.dom.viewport.height();

        // Public variables
        this.status        = false;
        this.loading       = false;

        $.extend(this.options, params);

        var self = this;

        // Private methods
        function showSpinner() {
            spinner.show();
            loadMoreAction.hide();
        }

        function hideSpinner() {
            spinner.hide();
            loadMoreAction.show();
        }

        function updateScroller(pageNumber) {

            if (pageNumber >= self.options.autoFetchMax) {

                disableAutofetch();
            } else {

                scrollerHeight = scroller.height(),
                scrollerScrollHeight = scroller[0].scrollHeight || Andamio.dom.viewport.height();
            }
        }

        function onScroll() {

            if (self.loading) return;

            var scrollTop;

            Andamio.util.delay(function () {
                scrollTop = Andamio.config.webapp ? scroller.scrollTop() : Andamio.dom.viewport.scrollTop();

                if (scrollTop + scrollerHeight + self.options.autoFetchThreshold >= scrollerScrollHeight) {

                    self.loadNextPage();
                }
            }, 300);
        }

        function enableAutofetch() {
            showSpinner();
            scroller.on("scroll", onScroll);
        }

        function disableAutofetch() {
            hideSpinner();
            scroller.off("scroll", onScroll);
        }

        // Public methods
        this.enable = function () {

            // check wether the pagerWrapper exists and if it contains enough items
            if (self.options.pagerWrapper.length > 0 && self.options.itemsPerPage <= self.options.pagerWrapper[0].children.length) {

                self.status = true;

                // Add the load more button
                loadMoreAction.on("click", self.loadNextPage).insertAfter(self.options.pagerWrapper);

                // Add the spinner
                spinner.insertAfter(self.options.pagerWrapper).hide();

                if (self.options.autoFetch) {
                    enableAutofetch();
                }
            }
        };

        this.disable = function () {

            self.status = false;

            // Remove load more button and spinner
            loadMoreAction.off("click", self.loadNextPage).remove();
            spinner.remove();

            // Show the message that there are no more pages
            noMorePages.insertAfter(self.options.pagerWrapper);

            if (self.options.autoFetch) {
                disableAutofetch();
            }
        };

        this.loadNextPage = function (callback) {

            if (self.loading || ! self.status) return;

            self.loading = true;
            self.options.pageNumber++;

            if (! self.options.autoFetch) showSpinner();

            Andamio.page.load(self.options.url + self.options.pageNumber, self.options.expires, true, function (response) {

                self.loading = false;

                if (! self.options.autoFetch) hideSpinner();

                var content = false,
                    children = self.options.pagerWrapper.children().length;

                // Some API's return content as a JSON object
                if (response) {
                    if ($.isPlainObject(response)) {
                        if (! $.isEmptyObject(response.content)) {
                            content = response.content;
                        }
                    } else {
                        content = response;
                    }
                }

                // Insert the content
                self.options.pagerWrapper[0].insertAdjacentHTML("beforeend", content);

                // if less children than items per page are returned, disable the pager
                if (self.options.pagerWrapper.children().length - children < self.options.itemsPerPage) {
                    self.disable();
                }

                updateScroller(self.options.pageNumber);
                if ($.isFunction(callback)) callback(self.options.pageNumber);
                if ($.isFunction(self.options.callback)) self.options.callback(self.options.pageNumber);
            });
        };

        // Enable
        this.enable();
    }

    return {

        init: function (params) {

            return new Pager(params);
        }
    };

})();
