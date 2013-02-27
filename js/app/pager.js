/*jshint es5: true, browser: true, undef:true, unused:true */
/*global Andamio, $ */

Andamio.pager = (function () {

    var isActive,
        isAutofetching,
        isLoading,
        loadMoreAction,
        spinner,
        currentView,
        currentScroller,
        currentScrollerHeight,
        currentScrollerScrollHeight;

    function enablePager(self) {

        isActive = true;

        currentView = Andamio.views.list.lookup(Andamio.views.currentView),
        currentScroller = currentView.scroller,
        currentScrollerHeight = currentScroller.height(),
        currentScrollerScrollHeight = currentScroller[0].scrollHeight || Andamio.dom.viewport.height();

        loadMoreAction.insertAfter(Andamio.dom.pagerWrapper);
        spinner.insertAfter(Andamio.dom.pagerWrapper).hide();

        if (Andamio.config.pager.autoFetch) {
            self.autoFetching = true;
        }

        loadMoreAction.on("click", function () {
            self.loadNextPage();
        });
    }

    function disablePager(self) {

        isActive = false;

        if (Andamio.config.pager.autoFetch) {
            self.autoFetching = false;
        }

        loadMoreAction.off("click", function () {
            self.loadNextPage();
        });

        loadMoreAction.remove();
        spinner.remove();
    }

    function showSpinner() {
        spinner.show();
        loadMoreAction.hide();
    }

    function hideSpinner() {
        spinner.hide();
        loadMoreAction.show();
    }

    function Pager(params) {

        this.params = $.isPlainObject(params) ? params : {};

        Andamio.dom.pagerWrapper = this.params.elem || Andamio.views.list.lookup(Andamio.views.currentView).content.find(".js-pager-list");
        loadMoreAction = this.params.loadMoreAction || $('<div class="pager-action"><a href="javascript:void(0)" class="button button-block action-load-more">Load more</a></div>');
        spinner = this.params.spinner || $('<div class="pager-loading">Loading...</div></div>');

        // Store options in global config
        Andamio.config.pager = {
            autoFetch           : this.params.autoFetch || false,
            autoFetchMax        : this.params.autoFetchMax || 3,
            autoFetchThreshold  : this.params.autoFetchThreshold || 100,
            callback            : $.isFunction(this.params.callback) ? this.params.callback : function () {},
            expires             : this.params.expires || null,
            itemsPerPage        : this.params.itemsPerPage || 10,
            loadMoreAction      : loadMoreAction,
            spinner             : spinner,
            url                 : this.params.url || Andamio.config.server + "?page="
        };

        this.pageNumber = this.params.pageNumber || 0;

        Object.defineProperties(this, {
            autoFetching: {
                get: function () {
                    return isAutofetching;
                },

                set: function (value) {

                    isAutofetching = value;
                    var self = this;

                    if (value) {

                        spinner.show();
                        loadMoreAction.hide();

                        currentScroller.on("scroll", function () {
                            self.onScroll();
                        });
                    } else {
                        currentScroller.off("scroll");

                        spinner.hide();
                        loadMoreAction.show();
                    }
                }
            },

            status: {
                get: function () {
                    return isActive;
                },

                set: function (value) {

                    var self = this;

                    if (value) {
                        enablePager(self);
                    } else {
                        disablePager(self);
                    }
                },
            }
        });

        // Activate
        if (Andamio.dom.pagerWrapper.length > 0) {
            if (Andamio.config.pager.itemsPerPage <= Andamio.dom.pagerWrapper[0].children.length) {
                this.status = true;
            }
        }
    }

    Pager.prototype.loadNextPage = function (callback) {

        if (! isLoading) {

            isLoading = true;
            this.pageNumber++;

            var self = this;

            if (! self.autoFetching) {
                showSpinner();
            }

            Andamio.page.load(Andamio.config.pager.url + self.pageNumber, Andamio.config.pager.expires, function (response) {

                isLoading = false;

                if (response) {
                    Andamio.dom.pagerWrapper.append(response);

                    if (! self.autoFetching) {
                        hideSpinner();
                    }

                    currentScrollerHeight = currentScroller.height();
                    currentScrollerScrollHeight = currentScroller[0].scrollHeight || Andamio.dom.viewport.height();

                    if ($.isFunction(callback)) {
                        callback(self.pageNumber);
                    }

                    Andamio.config.pager.callback(self.pageNumber);

                } else {

                    self.status = false;
                }
            });
        }
    };

    Pager.prototype.onScroll = function () {

        if (! isLoading) {

            var scrollTop = currentScroller.scrollTop(),
                self = this;

            Andamio.util.delay(function () {

                if (scrollTop + currentScrollerHeight + Andamio.config.pager.autoFetchThreshold >= currentScrollerScrollHeight) {

                    self.loadNextPage(function () {

                        // make sure the scrolltop is saved
                        currentScroller.scrollTop(scrollTop);

                        if (self.pageNumber >= Andamio.config.pager.autoFetchMax) {

                            self.autoFetching = false;
                        }
                    });
                }
            }, 300);
        }
    };

    return {

        init: function (options) {

            return new Pager(options);
        }
    };

})();
