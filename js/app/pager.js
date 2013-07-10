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
        queryParam          : true, // when true, will add the named argument "page=pageNumber" to the URL
        url                 : Andamio.config.server // URL that should be loaded. The pageNumber is automatically appended
    })

 **/

Andamio.pager = (function () {

    function Pager(params) {

        // Private variables
        this.errorMessage   = $('<div class="alert alert-error display-none">' + Andamio.i18n.pagerErrorMessage + '</div>');
        this.loadMoreAction = $('<div class="pager-action"></div>').append(this.errorMessage).append($('<a href="javascript:void(0)" class="button button-block action-load-more">' + Andamio.i18n.pagerLoadMore + '</a>'));
        this.spinner        = $('<div class="pager-loading display-none"><i class="icon icon-spinner-light"></i><span class="icon-text">' + Andamio.i18n.pagerLoading + '</span></div>');
        this.noMorePages    = $('<div class="pager-action">' + Andamio.i18n.pagerNoMorePages + '</div>');
        this.scroller       = Andamio.views.currentView.scroller;
        this.scrollerHeight = this.scroller.height();
        this.scrollerScrollHeight = this.scroller[0].scrollHeight || Andamio.dom.viewport.height();
        this.scrollCallback = null;

        // Public variables
        this.status        = false;
        this.loading       = false;
        this.options       = params;

        this.enable();
    }

    Pager.prototype.showSpinner = function () {
        this.errorMessage.addClass("display-none");
        this.spinner.removeClass("display-none");
        this.loadMoreAction.addClass("display-none");
    };

    Pager.prototype.hideSpinner = function () {
        this.errorMessage.addClass("display-none");
        this.spinner.addClass("display-none");
        this.loadMoreAction.removeClass("display-none");
    };

    Pager.prototype.updateScroller = function () {

        if (this.options.pageNumber >= this.options.autoFetchMax) {

            this.disableAutofetch();
        } else {

            this.scrollerHeight = this.scroller.height(),
            this.scrollerScrollHeight = this.scroller[0].scrollHeight || Andamio.dom.viewport.height();
        }
    };

    Pager.prototype.onScroll = function () {

        if (this.loading) return;

        // In website mode, the scroller is the window, but the viewport holds the actual scrollTop value
        var scrollTop = Andamio.views.currentView.scrollPosition;

        if (scrollTop + this.scrollerHeight + this.options.autoFetchThreshold >= this.scrollerScrollHeight) {

            this.loadNextPage();
        }
    };

    Pager.prototype.enableAutofetch = function () {

        var self = this,
            scrollTimeout = null;

        this.showSpinner();

        /*
         * create a scroll callback which calls our real self.onScroll with a 250ms timeout for performance
         *  store the callback in `this.scrollCallback` so that we can remove the event handler when we destruct the pager
         *
         * Afaik you can't $.proxy this callback, because then we can't seem to remove the event handler when we destruct the pager
         */
        this.scrollCallback = function () {
            if (scrollTimeout) {
                // clear the timeout, if one is pending
                clearTimeout(scrollTimeout);
                scrollTimeout = null;
            }

            scrollTimeout = setTimeout($.proxy(self.onScroll, self), 250);
        };

        this.scroller.on("scroll", this.scrollCallback);
    };

    Pager.prototype.disableAutofetch = function () {
        this.hideSpinner();
        this.scroller.off("scroll", this.scrollCallback);
    };

    Pager.prototype.enable = function () {

        var self = this;

        // check wether the pagerWrapper exists and if it contains enough items
        if (this.options.pagerWrapper.length > 0 && this.options.itemsPerPage <= this.options.pagerWrapper[0].children.length) {

            this.status = true;

            // Add the load more button
            this.loadMoreAction.on("click", $.proxy(self.loadNextPage, self)).insertAfter(this.options.pagerWrapper);

            // Add the spinner
            this.spinner.insertAfter(this.options.pagerWrapper);

            if (this.options.autoFetch) {
                this.enableAutofetch();
            }
        }
    };

    Pager.prototype.disable = function () {

        this.status = false;

        // Remove load more button and spinner
        this.loadMoreAction.off("click").remove();
        this.spinner.remove();

        if (this.options.autoFetch) {
            this.disableAutofetch();
        }
    };

    Pager.prototype.loadNextPage = function () {

        if (this.loading || ! this.status) return;

        this.loading = true;
        this.options.pageNumber++;

        if (! this.options.autoFetch) this.showSpinner();

        var self = this;

        // If there are still requests pending, cancel them
        Andamio.page.abortRequest();

        Andamio.page.load(this.options.url + this.options.pageNumber, this.options.expires, true, function (response, errorType) {

            if (errorType) {

                // disable autofetching, if the connection isn't working properly, there's no use anyway
                self.disableAutofetch();

                // show the error
                self.loadMoreAction.removeClass("display-none");
                self.errorMessage.removeClass("display-none");

                // make sure we're still able to load the same page
                self.loading = false;
                self.options.pageNumber--;
            } else {

                // hide the error if it was previously shown
                self.errorMessage.addClass("display-none");

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

                // if autofetch was disabled (e.g. due to network error), check if it needs to be enabled again
                if (self.options.pageNumber < self.options.autoFetchMax) {
                    self.enableAutofetch();
                } else {
                    self.disableAutofetch();
                }

                // Done loading
                self.loading = false;
                if (! self.options.autoFetch) self.hideSpinner();

                // if less children than items per page are returned, disable the pager
                if (self.options.pagerWrapper.children().length - children < self.options.itemsPerPage) {
                    self.disable();

                    // Show the message that there are no more pages
                    self.noMorePages.insertAfter(self.options.pagerWrapper);
                }

                self.updateScroller();
                if ($.isFunction(self.options.callback)) self.options.callback(self.options.pageNumber);
            }
        });
    };

    return {

        init: function (params) {

            // Setup defaults
            var options = {
                autoFetch           : true,
                autoFetchMax        : 3,
                autoFetchThreshold  : 100,
                callback            : function () {},
                expires             : null,
                itemsPerPage        : 10,
                pageNumber          : 0,
                pagerWrapper        : Andamio.views.currentView.content.find(".js-pager-list"),
                queryParam          : true,
                url                 : Andamio.config.server
            };

            $.extend(options, params);

            // Check how to add the query parameter
            if (options.queryParam) options.url += options.url.indexOf("?") === -1 ? "?page=" : "&page=";

            return new Pager(options);
        }
    };

})();
