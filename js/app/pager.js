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
        url                 : Andamio.config.server + "?page=" // URL that should be loaded. The pagenumber is automatically appended
    })

 **/

Andamio.pager = (function () {

    var self,
        status,
        options,
        loading,
        loadMoreAction,
        spinner,
        noMorePages,
        scrollTop,
        scroller,
        scrollerHeight,
        scrollerScrollHeight;

    function showSpinner() {
        spinner.show();
        loadMoreAction.hide();
    }

    function hideSpinner() {
        spinner.hide();
        loadMoreAction.show();
    }

    function onScroll() {

        if (loading) return;

        Andamio.util.delay(function () {

            scrollTop = scroller.scrollTop();

            if (scrollTop + scrollerHeight + options.autoFetchThreshold >= scrollerScrollHeight) {

                self.loadNextPage(function (pageNumber) {

                    if (pageNumber >= options.autoFetchMax) {

                        disableAutofetch();
                    } else {

                        scrollerHeight = scroller.height(),
                        scrollerScrollHeight = scroller[0].scrollHeight || Andamio.dom.viewport.height();
                    }
                });
            }

        }, 300);
    }

    function enableAutofetch() {

        spinner.show();
        loadMoreAction.hide();

        scrollerHeight = scroller.height(),
        scrollerScrollHeight = scroller[0].scrollHeight || Andamio.dom.viewport.height();

        scroller.on("scroll", onScroll);
    }

    function disableAutofetch() {

        scroller.off("scroll");

        spinner.hide();
        loadMoreAction.show();
    }

    return {

        enable: function () {

            // check wether the pagerWrapper exists and if it contains enough items
            if (options.pagerWrapper.length > 0 && options.itemsPerPage <= options.pagerWrapper[0].children.length) {

                status = true;

                // Add the load more button
                loadMoreAction.on("click", self.loadNextPage).insertAfter(options.pagerWrapper);

                // Add the spinner
                spinner.insertAfter(options.pagerWrapper).hide();

                if (options.autoFetch) {
                    enableAutofetch();
                }
            }
        },

        disable: function () {

            status = false;

            // Remove load more button and spinner
            loadMoreAction.off("click", self.loadNextPage).remove();
            spinner.remove();

            // Show the message that there are no more pages
            noMorePages.insertAfter(options.pagerWrapper);

            if (options.autoFetch) {
                disableAutofetch();
            }
        },

        get status() {
            return status;
        },

        get options() {
            return options;
        },

        loadNextPage: function (callback) {

            if (loading) return;

            loading = true;

            if (! options.autoFetch) {
                showSpinner();
            }

            options.pageNumber++;

            Andamio.page.load(options.url + options.pageNumber, options.expires, true, function (response) {

                loading = false;

                if (! options.autoFetch) {
                    hideSpinner();
                }

                var content = false,
                    temp = document.createElement('div');

                if (response) {
                    if ($.isPlainObject(response)) {
                        if (! $.isEmptyObject(response.content)) {
                            content = response.content;
                        }
                    } else {
                        content = response;
                    }
                }

                temp.insertAdjacentHTML("beforeend", content);

                if (temp.childElementCount > 0) {
                    options.pagerWrapper.append(content);
                }

                if (temp.childElementCount < options.itemsPerPage) {
                    self.disable();
                }

                if ($.isFunction(callback)) callback(options.pageNumber);
                if ($.isFunction(options.callback)) options.callback(options.pageNumber);
            });
        },

        init: function (params) {

            // Setup defaults
            options = {
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

            loadMoreAction  = $('<div class="pager-action"><a href="javascript:void(0)" class="button button-block action-load-more">' + Andamio.i18n.pagerLoadMore + '</a></div>');
            spinner         = $('<div class="pager-loading">' + Andamio.i18n.pagerLoading + '</div></div>');
            noMorePages     = $('<div class="pager-action">' + Andamio.i18n.pagerNoMorePages + '</div>');
            scroller        = Andamio.views.currentView.scroller;

            $.extend(options, params);

            self = this;
            self.enable();

            return self;
        }
    };

})();
