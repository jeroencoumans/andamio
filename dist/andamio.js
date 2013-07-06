/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

window.Andamio = {};

Andamio.dom = (function () {

    return {
        win:            $(window),
        doc:            $(window.document),
        html:           $("html"),
        viewport:       $(".viewport")
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

Andamio.i18n = {
    ajaxGeneralError: "Computer said no:",
    ajaxNotFound: "The page couldn't be found.",
    ajaxTimeout: "The server timed out waiting for the request.",
    ajaxServerError: "The server is having problems, try again later.",
    ajaxRetry: "Load again",
    offlineMessage: "It seems your internet connection is offline.",
    pageLoaderText: "Loading&hellip;",
    pagerLoadMore: "Load more",
    pagerLoading: "Loading&hellip;",
    pagerNoMorePages: "There are no more items.",
    pagerErrorMessage: "There was an error loading more pages"
};

/*jshint es5: true, browser: true, undef:true, unused:true, boss:true */
/*global Andamio, FastClick */

Andamio.config = (function () {

    /*** Zepto detect.js ***/
    var detect = function (ua) {
        var os = this.os = {}, browser = this.browser = {},
            webkit = ua.match(/WebKit\/([\d.]+)/),
            android = ua.match(/(Android)\s+([\d.]+)/),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            playbook = ua.match(/PlayBook/),
            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            firefox = ua.match(/Firefox\/([\d.]+)/);

        if (browser.webkit = !!webkit) browser.version = webkit[1];

        if (android) os.android = true, os.version = android[2];
        if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
        if (webos) os.webos = true, os.version = webos[2];
        if (touchpad) os.touchpad = true;
        if (blackberry) os.blackberry = true, os.version = blackberry[2];
        if (bb10) os.bb10 = true, os.version = bb10[2];
        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
        if (playbook) browser.playbook = true;
        if (kindle) os.kindle = true, os.version = kindle[1];
        if (silk) browser.silk = true, browser.version = silk[1];
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
        if (chrome) browser.chrome = true, browser.version = chrome[1];
        if (firefox) browser.firefox = true, browser.version = firefox[1];

        os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)));
        os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
            (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))));
    };

    return {

        init: function (options) {

            detect.call(this, navigator.userAgent);

            if (this.os.ios) {
                this.os.ios5 = this.os.version.indexOf("5.") !== -1;
                this.os.ios6 = this.os.version.indexOf("6.") !== -1;
            }

            if (this.os.android) {
                this.os.android2 = this.os.version >= "2" && this.os.version < "4"; // yes we also count android 3 as 2 ;-)
                this.os.android4 = this.os.version >= "4" && this.os.version < "5";
            }

            // Setup defaults that can be overridden
            var win = window;

            this.webapp  = win.location.search.search("webapp") > 0 || win.navigator.standalone || Andamio.dom.html.hasClass("webapp");
            this.tmgcontainer = win.navigator.userAgent.indexOf("TMGContainer") > -1;
            this.server  = win.location.origin + win.location.pathname;
            this.touch   = 'ontouchstart' in win;
            this.cache   = window.lscache ? window.lscache.supported() : false;

            // Default expiration times, configurable per view
            this.expiration = {
                all: 24 * 60,
                parentView: 30
            };

            if (Andamio.dom.doc.width() >= 980) {
                this.os.tablet = true;
            }

            if (this.touch) {
                this.fastclick = new FastClick(win.document.body);
            } else {
                Andamio.dom.html.addClass("no-touch");
            }

            // Setup user-defined options
            if (typeof options === "object") {
                for (var key in options) {

                    switch (key) {
                    case "init":
                        break;
                    case "i18n":
                        for (var string in options.i18n) {
                            Andamio.i18n[string] = options.i18n[string];
                        }
                        break;
                    default:
                        this[key] = options[key];
                        break;
                    }
                }
            }

            if (this.tmgcontainer) {
                this.webapp = true;
            }

            if (this.os.tablet) {
                Andamio.dom.html.addClass("tablet");
                Andamio.nav.show();
                this.webapp = true;
            }

            if (this.os.android) {
                this.webapp = false;
            }

            if (this.webapp) {
                Andamio.dom.html.removeClass("website").addClass("webapp");
            } else {
                Andamio.dom.html.removeClass("webapp").addClass("website");
            }

            this.website = !this.webapp;

            for (var os in this.os) {
                if (Andamio.config.os[os] && os !== "version") {
                    Andamio.dom.html.addClass(os);
                }
            }
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */
Andamio.events = (function () {

    var isLocked = false,
        lockTimer;

    return {

        get status() {
            return isLocked;
        },

        lock: function (timeout) {

            if (! isLocked) {

                isLocked = true;
                timeout = (typeof timeout === "number" && timeout > 0) ? timeout : 300;

                lockTimer = setTimeout(function () {

                    isLocked = false;
                }, timeout);
            }
        },

        unlock: function () {

            clearTimeout(lockTimer);
            isLocked = false;
        },

        attach: function (selector, fn, lock, timeout) {

            Andamio.dom.viewport.on("click", selector, function (e) {

                if (! isLocked) {

                    if (lock) {
                        Andamio.events.lock(timeout);
                    }

                    fn(e);
                }

                return false;
            });
        },

        detach: function (selector) {

            Andamio.dom.viewport.off("click", selector);
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.util = (function () {

    return {

        last: function (list) {
            if (list.length > 0) {
                return list[list.length - 1];
            }
        },

        prev: function (list) {
            if (list && list.length > 1) {
                return list[list.length - 2];
            }
        },

        addUniq: function (value, list) {
            if (value !== this.last(list)) {
                list.push(value);
            }
        },

        addOnly: function (value, list) {

            if (list.indexOf(value) < 0) {
                list.push(value);
            }
        },

        /*
         * Get URL from the data attribute, falling back to the href
         * @method getUrl
         * @param {HTMLElement} elem the element to get the URL from
         * @return {String} Will return the URL when a `data-url` value is found, else return the href if an href is found that doesn't start with `javascript`, else return the hash if hash is found
         */
        getUrl: function (elem) {

            var href = $(elem).attr("href").indexOf("javascript") !== 0 ? $(elem).attr("href") : false;
            return $(elem).data("url") || href || $(elem).hash;
        },

        /**
         * Get title from the data attribute, falling back to the text
         * @method getTitle
         * @param {HTMLElement} elem the element to get the title from
         * @return {String} the value of `data-title` if it's found, else the text of the element
         */
        getTitle: function (elem) {

            return $(elem).data("title") || $(elem).text();
        }

    };
})();

Andamio.util.delay = (function () {
    var timer = 0;

    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.container = (function () {

    function initContainer() {

        Andamio.config.phone = {
            updateTimestamp: new Date(),
            updateTimeout: Andamio.config.expiration.parentView * 1000
        };

        // hide splashscreen
        if (navigator.splashscreen) navigator.splashscreen.hide();

        // Listens to all clicks on anchor tags and opens them in Cordova popover if it's an external URL
        Andamio.events.attach('.action-external', function (event) {

            var target  = $(event.currentTarget),
                href = target.attr("href");

            if (navigator.utility && navigator.utility.openUrl) {
                navigator.utility.openUrl(href, "popover");
            }
        });

        Andamio.dom.doc.on("statusbartap", function () {

            var scroller = Andamio.nav.status ? Andamio.dom.pageNav : Andamio.views.currentView.scroller;

            if ($.scrollTo) {
                scroller.scrollTo(0, 400);
            } else if ($.scrollElement) {
                $.scrollElement(scroller[0], 0);
            }
        });

        Andamio.dom.doc.on("pause", function () {
            Andamio.config.phone.updateTimestamp = new Date();
        });

        Andamio.dom.doc.on("resume", function () {

            var now = new Date();

            // Refresh parentView if longer than updateTimeout has passed
            if (now - Andamio.config.phone.updateTimestamp > Andamio.config.phone.updateTimeout) {
                Andamio.views.refreshView(Andamio.views.parentView);
            }
        });
    }

    return {

        init: function () {

            if (navigator.bootstrap) {
                navigator.bootstrap.addConstructor(initContainer);
            } else {
                Andamio.dom.doc.on("deviceready", initContainer);
            }
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

Andamio.cache = (function () {

    var cache;

    return {

        get: function (key) {

            if (key && cache) {
                var result = cache.get(key);

                if (result) {
                    return result;
                }
            }
        },

        set: function (key, data, expiration) {

            if (key && data && cache) {
                var minutes = (typeof expiration === "number") ? expiration : Andamio.config.expiration.all;
                cache.set(key, data, minutes);
            }
        },

        remove: function (key) {

            if (key && cache) {
                cache.remove(key);
            }
        },

        flush: function () {

            if (cache) {
                cache.flush();
            }
        },

        setBucket: function (bucket) {

            if (cache) {
                cache.setBucket(bucket);
            }
        },

        init: function () {

            cache = Andamio.config.cache ? window.lscache : false;
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

Andamio.connection = (function () {

    var isOnline;

    return {

        goOnline: function () {
            isOnline = true;
            Andamio.dom.html.removeClass("is-offline");
        },

        goOffline: function () {

            isOnline = false;
            Andamio.dom.html.addClass("is-offline");
        },

        get status() {
            return isOnline;
        },

        get type() {

            return navigator.connection ? navigator.connection.type : "ethernet";
        },

        get isFast() {
            return this.type === "wifi" || this.type === "ethernet";
        },

        init: function () {

            // Setup initial state
            isOnline = navigator.connection ? navigator.connection.type !== "none" : navigator.onLine;

            // Register event handlers
            Andamio.dom.doc.on("offline", this.goOffline);
            Andamio.dom.doc.on("online",  this.goOnline);
        }
    };

})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.page = (function () {

    var activeRequest = null;

    return {

        get activeRequest() {
            return activeRequest;
        },

        abortRequest: function () {
            if (activeRequest) {

                activeRequest.abort();
                activeRequest = null;
            }
        },

        doRequest: function (url, expiration, cache, callback) {

            var onError = function (xhr, type) {

                // type is one of: "timeout", "error", "abort", "parsererror"
                var status = xhr.status,
                    errorMessage = (type === "timeout") ? '<h3 class="alert-title">' + Andamio.i18n.ajaxTimeout + '</h3>': '<h3 class="alert-title">' + Andamio.i18n.ajaxGeneralError + '</h3><p>' + type + " " + status + '</p>',
                    errorHTML = '<div class="alert alert-error">' + errorMessage + '<a href="javascript:void(0)" class="button button-primary button-block action-refresh">' + Andamio.i18n.ajaxRetry + '</a>';

                if (type === "timeout") {

                    Andamio.connection.goOffline();
                }

                // Pass the errorHTML and error type to the callback
                callback(errorHTML, type);
            },

            onSuccess = function (response) {

                Andamio.connection.goOnline();
                Andamio.cache.set(url, response, expiration);
                callback(response);
            },

            onComplete = function () {

                activeRequest = null;
            };

            activeRequest = $.ajax({
                url: url,
                cache: cache,
                headers: {
                    "X-PJAX": true,
                    "X-Requested-With": "XMLHttpRequest",
                    "X-Fast-Connection": Andamio.connection.isFast
                },
                error: onError,
                success: onSuccess,
                complete: onComplete
            });
        },

        /**
         * This method should be the preferred way of loading a new page.
         * It takes care of retrieving a URL from the server, and storing it for a specified time in cache
         * If the URL has already been stored, it will return the content from cache
         *
         * @method load
         * @param url {String} the URL that should be loaded
         * @param expiration {Number} the number of minutes that the response will be cached (after that, it will be fetched from the server again)
         * @param cache {Boolean} true if the request may retrieve a cached Ajax response, false to force an update (by appending the current timestamp to the URL)
         * @param callback {Function} function that receives the response; this function should accept two parameters: the first is the content, the second is the errorType (if any)
         */
        load: function (url, expiration, cache, callback) {

            var cachedContent = Andamio.cache.get(url);

            if (cachedContent) {

                callback(cachedContent);
            } else {

                this.doRequest(url, expiration, cache, callback);
            }
        },

        /**
         * This method should be the preferred way of refreshing a page.
         * It always does an Ajax request and forces the server to send an updated version (by appending the current timestamp)
         * Should the request fail, it will return the cached content (if any)
         *
         * @method refresh
         * @param url {String} the URL that should be reloaded
         * @param expiration {Number} the number of minutes that the response will be cached (after that, it will be fetched from the server again)
         * @param callback {Function} function that receives the response; this function should accept two parameters: the first is the content, the second is the errorType (if any)
         */
        refresh: function (url, expiration, callback) {

            var cachedContent = Andamio.cache.get(url);

            if (cachedContent) {

                this.doRequest(url, expiration, false, function (response, error) {

                    if (error) {
                        callback(cachedContent, error);
                    } else {
                        callback(response);
                    }
                });

            } else {

                this.doRequest(url, expiration, false, callback);
            }
        }
    };

})();

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
            scrollTimeout;

        this.showSpinner();
        this.scroller.on("scroll", function () {

            if (scrollTimeout) {
                // clear the timeout, if one is pending
                clearTimeout(scrollTimeout);
                scrollTimeout = null;
            }

            scrollTimeout = setTimeout($.proxy(self.onScroll, self), 250);
        });
    };

    Pager.prototype.disableAutofetch = function () {
        this.hideSpinner();
        this.scroller.off("scroll"); // TODO: only remove own scroll handler?!
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

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

/**
 * Controls global alerts
 * @author Jeroen Coumans
 * @class alert
 * @namespace Andamio
 */

// Register DOM references
Andamio.dom.pageAlert = $(".js-page-alert");

Object.defineProperties(Andamio.dom, {

    pageAlertText: {

        get: function () {
            return this.pageAlert.find(".js-page-alert-text").text();
        },

        set: function (str) {
            this.pageAlert.find(".js-page-alert-text").html(str);
        }
    }
});

Andamio.alert = (function () {

    var isActive;

    return {

        /**
         * Show alert
         * @method show
         * @param {String} msg the message of the alert
         */
        show: function (msg) {

            if (msg) {
                Andamio.dom.pageAlertText = msg;
            }

            isActive = true;
            Andamio.dom.pageAlert.removeClass("display-none");
        },

        /**
         * Hide alert
         * @method hide
         */
        hide: function () {

            isActive = false;
            Andamio.dom.pageAlert.addClass("display-none");
        },

        /**
         * Status of alert
         * @method status
         * @return {Boolean} true when alert is displayed, false when alert is hidden
         */
        get status() {

            return isActive;
        },

        /**
         * Initialize variables and attach listeners
         * @method init
         */
        init: function () {

            // Setup initial state
            isActive = false;

            // Register event handlers
            Andamio.events.attach(".action-hide-alert", this.hide);
            Andamio.dom.doc.on("Andamio:views:activateView:start", this.hide);
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

// Register DOM references
Andamio.dom.pageLoader = $(".js-page-loader");
Andamio.dom.pageLoaderImg = Andamio.dom.pageLoader.find(".js-page-loader-spinner");

Object.defineProperties(Andamio.dom, {
    pageLoaderText: {

        get: function () {
            return this.pageLoader.find(".js-page-loader-text").text();
        },

        set: function (str) {
            this.pageLoader.find(".js-page-loader-text").html(str);
        }
    }
});

Andamio.loader = (function () {

    var isActive;

    return {
        show: function (msg) {

            isActive = true;

            msg = typeof msg === "string" ? msg : Andamio.i18n.pageLoaderText;
            Andamio.dom.pageLoaderText = msg;

            if (Andamio.config.tmgcontainer) {
                if (navigator.spinner) {
                    navigator.spinner.show({"message": msg});
                }
            }
            else {
                Andamio.dom.pageLoader.removeClass("display-none");
            }
        },

        hide: function () {

            isActive = false;

            if (Andamio.config.tmgcontainer) {
                if (navigator.spinner) {
                    navigator.spinner.hide();
                }
            }
            else {
                Andamio.dom.pageLoader.addClass("display-none");
            }
        },

        get status() {

            return isActive;
        },

        init: function () {

            // Setup initial state
            isActive = false;

            var self = this,
                timeoutToken;

            // Register event handlers
            Andamio.dom.doc.on("Andamio:views:activateView:start", function () {

                // show loader if nothing is shown within 0,250 seconds
                timeoutToken = setTimeout(function () {
                    self.show();

                }, 250);
            });

            Andamio.dom.doc.on("Andamio:views:activateView:finish", function () {

                clearTimeout(timeoutToken);
                self.hide();
            });

            Andamio.dom.doc.on("ajaxError", function () {

                clearTimeout(timeoutToken);
                self.hide();
            });
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

// Register DOM references
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

            if (Andamio.config.webapp) {
                Andamio.events.lock();
            }

            Andamio.dom.html.addClass("has-navigation");

            if (!Andamio.config.webapp) {
                setPageHeight(navheight);
            }
        },

        hide: function () {
            isActive = false;

            if (Andamio.config.webapp) {
                Andamio.events.lock();
            }

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

            // Setup initial state
            isActive = Andamio.dom.html.hasClass("has-navigation");

            if (! Andamio.config.webapp) {
                docheight = Andamio.dom.win[0].innerHeight; // innerHeight is more reliable on Android
                navheight = Andamio.dom.pageNav.height();

                // make sure the navigation is as high as the page
                if (docheight > navheight) {
                    navheight = docheight;
                    Andamio.dom.pageNav.height(navheight);
                }
            }

            // Register event handlers
            Andamio.events.attach(".action-show-nav", self.show);
            Andamio.events.attach(".action-hide-nav", self.hide);

            if (Andamio.config.touch) {
                Andamio.dom.doc.on("touchmove", ".action-hide-nav", function (event) {
                    event.preventDefault();
                });
            }

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
                    Andamio.views.parentView.title = title;
                }

                if (url) {
                    Andamio.views.openParentPage(url);
                }
            });
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.pulltorefresh = (function () {

    function PullToRefresh(view, options) {

        if (! view.scroller) {
            throw "view must have a scroller";
        }

        this.view           = view;
        this.scrollCache    = 0;
        this.options        = options;
        this.active         = false;
        this.loading        = false;

        this.enable();
    }

    PullToRefresh.prototype = {

        enable: function () {

            this.active = true;
            this.loading = false;

            this.view.scroller
                .addClass("has-pull-to-refresh")
                .on("touchmove",    $.proxy(this.onTouchMove, this))
                .on("touchstart",   $.proxy(this.onTouchStart, this))
                .on("touchend",     $.proxy(this.onTouchEnd, this));

        },

        disable: function () {

            this.view.scroller
                .removeClass("has-pull-to-refresh")
                .off("touchmove",   $.proxy(this.onTouchMove, this))
                .off("touchstart",  $.proxy(this.onTouchStart, this))
                .off("touchend",    $.proxy(this.onTouchEnd, this));

            this.active = false;
            this.loading = false;
        },

        onTouchStart: function () {

            // cache the scrollTop to determine if we need to set a timeout or not
            this.scrollCache = this.view.scrollPosition;
        },

        onTouchMove: function () {

            // don't bother doing anything if the stored scrollTop wouldn't result in an actual PTR
            if (this.scrollCache > this.options.offset) return;

            // start live listening
            if (this.view.scrollPosition < this.options.threshold) {

                this.view.scroller.addClass("can-refresh");
            } else {

                this.view.scroller.removeClass("can-refresh");
            }
        },

        onTouchEnd: function () {

            // cache the last scrollTop again
            this.scrollCache = this.view.scrollPosition;

            if (this.scrollCache > this.options.offset) return;

            if (this.scrollCache < this.options.threshold) {

                this.loading = true;
                this.view.scroller.addClass("is-refreshing").removeClass("can-refresh");
                Andamio.views.currentView.content[0].innerHTML = "";
                Andamio.loader.show();

                var onRefreshEnd = this.onRefreshEnd.call(this);

                // Set a hardcoded delay to actually refresh, since it sometimes happens so fast it causes a jarring experience
                Andamio.util.delay(function () {
                    Andamio.views.refreshView(Andamio.views.currentView, onRefreshEnd);
                }, 300);
            }
        },

        onRefreshEnd: function () {

            this.loading = false;
            this.view.scroller.removeClass("is-refreshing");
            this.options.callback();
        }

    };

    return {

        init: function (view, params) {

            // By default, we set the pull to refresh on the parentView
            var options = {
                callback  : function () {},
                threshold : -50,
                offset    : 150
            };

            $.extend(options, params);

            return new PullToRefresh(view, options);
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.reveal = (function () {

    return {
        init: function () {

            Andamio.events.attach(".action-reveal", function (event) {

                var activeReveal,
                    activeContent,
                    targetContent,
                    activeClass = 'active',
                    activeClassSelector = '.' + activeClass,
                    target = $(event.currentTarget);

                if (!target) {
                    return;
                }

                activeReveal = target.siblings(activeClassSelector);

                if (activeReveal) {
                    activeReveal.removeClass(activeClass);
                }

                target.addClass(activeClass);

                targetContent = Andamio.util.getUrl(target);

                if (!targetContent) {
                    return;
                }

                activeContent = $(targetContent).siblings(activeClassSelector);

                if (activeContent) {
                    activeContent.removeClass("active");
                }

                $(targetContent).addClass(activeClass);

                // don't follow the link
                event.preventDefault();
            });
        }
    };

})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $, Swipe */

Andamio.slideshow = (function () {

    function SwipeDots(number) {
        this.wrapper = $('<div class="slideshow-dots">');

        for (var i = 0; i < number; i++) {
            this.wrapper.append($('<div class="slideshow-dot"></div>'));
        }

        this.items = this.wrapper.find(".slideshow-dot");

        Object.defineProperties(this, {
            active: {
                get: function () { return this.wrapper.find(".active"); },
                set: function (elem) {
                    this.wrapper.find(".active").removeClass("active");
                    $(elem).addClass("active");
                }
            }
        });

        this.active = this.items.first();
    }

    function Slideshow(id, params, callback) {

        var self = this;

        this.options = {
            callback: function (index, item) {

                self.dots.active = self.dots.items[index];

                if ($.isFunction(callback)) {
                    callback(index, item);
                }
            }
        };

        $.extend(this.options, params);

        this.id = id;
        this.wrapper = $("#" + id);
        this.slideshow = new Swipe(document.getElementById(id), this.options);
        this.dots = new SwipeDots(this.slideshow.getNumSlides());

        this.dots.wrapper
            .insertAfter(self.wrapper)
            .on("click", function (event) {
                var target = event.target;

                self.dots.items.each(function (index, item) {

                    if (item === target) {
                        self.slideshow.slide(index, 300);
                    }
                });
            });

        // preload images
        this.wrapper.find(".js-slideshow-media").each(function (index, item) {

            var img = $(item),
                url = img.data("src");
            img.css('background-image', 'url(' + url + ')');
        });

        this.wrapper
            .on("click", ".action-slideshow-next", this.slideshow.next)
            .on("click", ".action-slideshow-prev", this.slideshow.prev);
    }

    Slideshow.prototype.destroy = function () {

        this.slideshow.kill();
        this.dots.wrapper.off("click").remove();

        // needs to go last
        this.wrapper
            .off("click", ".action-slideshow-next", this.slideshow.next)
            .off("click", ".action-slideshow-prev", this.slideshow.prev);
        this.wrapper.find(".slideshow-container").css("width", "");
    };

    return {

        init: function (id, params, callback) {

            if ($("#" + id).find(".slideshow-item").length > 1)
                return new Slideshow(id, params, callback);
        }
    };

})();

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

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

// Register DOM references
Andamio.dom.pageView     = $(".js-page-view");
Andamio.dom.parentView   = $(".js-parent-view");
Andamio.dom.childView    = $(".js-child-view");
Andamio.dom.childViewAlt = $(".js-child-view-alternate");
Andamio.dom.modalView    = $(".js-modal-view");
Andamio.dom.mediaView    = $(".js-media-view");

/*** TODO: add support for data-title ***/
Andamio.views = (function () {

    /**
     * A view has a container, optional content and position
     */
    function View(name, container, position) {
        this.name      = name;
        this.container = container;
        this.url       = "";

        if (position) {
            this.initialPosition = position;
            this.position = position;
        }
    }

    View.prototype = {

        /**
         * Slide the view based on the current position and the desired direction. Used only in webapp.
         * @method slide
         * @param direction {String} direction to which the view should slide
         */
        slide: function (to) {

            if (! this.position && ! this.initialPosition) return;

            var position = this.position,
                container = this.container,

                // This iif generates an object with three values
                // based on the current position and the new position.
                // These values are used to set and unset the right CSS classes when transitioning
                // e.g. "slide-default", "slide-left"
                opts = (function (from, to) {

                    var prefix = "slide-";
                    var opposites = {
                        "left"    : "right",
                        "right"   : "left",
                        "top"     : "bottom",
                        "bottom"  : "top",
                        "default" : "default"
                    };

                    // remove the prefix from our function arguments
                    from = from.substr(prefix.length, from.length);
                    to   = to.substr(prefix.length, to.length);

                    var direction = prefix + (from === "default" ? "out-to-" + to : "in-from-" + from);

                    return {
                        a: direction,                                   // "slide-out-to-left"
                        b: prefix + to,                                 // "slide-left"
                        c: direction + " " + prefix + from + " " + prefix + opposites[from]   // "slide-out-to-left slide-default"
                    };
                })(position, to);

            Andamio.events.lock();

            container.addClass(opts.a).one("webkitTransitionEnd", function () {
                container.addClass(opts.b).removeClass(opts.c);
                Andamio.events.unlock();
            });

            // update positions
            this.position = to;
        },

        /**
         * Resets the view to its original state
         */
        reset: function () {

            if (this.position && Andamio.config.webapp) {

                this.position = this.initialPosition;
                this.container
                    .removeClass("slide-left slide-right slide-default slide-bottom")
                    .addClass(this.position);
            }

            this.active = false;
            this.scrollPosition = 0;
        }
    };

    Object.defineProperties(View.prototype, {
        title: {
            configurable: true,
            get: function () {
                return this.container.find(".js-title");
            },
            set: function (value) {
                if (typeof value === "string") {
                    this.container.find(".js-title").text(value);
                }
            }
        },
        content: {
            configurable: true,
            get: function () {
                return this.container.hasClass("js-content") ? this.container : this.container.find(".js-content");
            }
        },
        scroller: {
            configurable: true,
            get: function () {
                if (Andamio.config.webapp) {
                    return this.container.hasClass("overthrow") ? this.container : this.container.find(".overthrow");
                } else {
                    return Andamio.dom.win;
                }
            }
        },
        scrollPosition: {
            get: function () {
                return Andamio.config.webapp ? this.scroller[0].scrollTop : Andamio.dom.viewport[0].scrollTop;
            },
            set: function (value) {
                if (Andamio.config.webapp && this.scroller.length) this.scroller[0].scrollTop = value;
                else Andamio.dom.viewport[0].scrollTop = value;
            }
        },
        active: {
            get: function () {
                return this.container.hasClass("view-active");
            },
            set: function (value) {
                if (value) {
                    this.container.addClass("view-active").removeClass("view-hidden");
                } else {
                    this.container.addClass("view-hidden").removeClass("view-active");
                }
            }
        },
        expiration: {
            get: function () {
                return Andamio.config.expiration[this.name] || Andamio.config.expiration.all;
            }
        }
    });

    // variables used in the returned object, defined in init()
    var parentView,
        childView,
        childViewAlt,
        modalView,
        mediaView;

    return {

        parentView   : new View("parentView",   Andamio.dom.parentView,   "slide-default"),
        childView    : new View("childView",    Andamio.dom.childView,    "slide-right"),
        childViewAlt : new View("childViewAlt", Andamio.dom.childViewAlt, "slide-right"),
        modalView    : new View("modalView",    Andamio.dom.modalView,    "slide-bottom"),
        mediaView    : new View("mediaView",    Andamio.dom.mediaView,    "slide-bottom"),

        urlHistory   : [],
        viewHistory  : [],
        scrollHistory: [],

        childCount   : 0,
        modalCount   : 0,
        mediaCount   : 0,

        get currentUrl()        { return Andamio.util.last(this.urlHistory); },
        set currentUrl(val)     { Andamio.util.addUniq(val, this.urlHistory); },

        get previousUrl()       { return Andamio.util.prev(this.urlHistory); },
        get currentView()       { return Andamio.util.last(this.viewHistory); },
        set currentView(val)    { this.viewHistory.push(val); },
        get previousView()      { return Andamio.util.prev(this.viewHistory); },

        get previousScrollPosition()    { return Andamio.util.last(this.scrollHistory); },
        set previousScrollPosition(val) { this.scrollHistory.push(val); },

        resetViews: function () {

            parentView.reset();
            childView.reset();
            childViewAlt.reset();
            modalView.reset();
            mediaView.reset();

            this.viewHistory = [];
            this.urlHistory = [];
            this.scrollHistory = [];
            this.childCount = 0;
            this.modalCount = 0;
        },

        loadView: function (view, url, scrollPosition, callback, refresh) {

            var onLoaded = function (response, errorType) {

                // we always get a response, even if there's an error
                view.content[0].innerHTML = response;
                this.currentUrl = url;
                view.url = url;

                if (typeof scrollPosition === "number" && view.scroller.length) {
                    view.scrollPosition = scrollPosition;
                }

                if (! errorType) {
                    Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [view, refresh ? "refresh" : "load", url]);
                }

                if ($.isFunction(callback)) {
                    callback();
                }
            };

            // If there are still requests pending, cancel them
            Andamio.page.abortRequest();

            view.content[0].innerHTML = "";
            Andamio.dom.doc.trigger("Andamio:views:activateView:start", [view, refresh ? "refresh" : "load", url]);

            if (refresh) {
                Andamio.page.refresh(url, view.expiration, $.proxy(onLoaded, this));
            }
            else {
                Andamio.page.load(url, view.expiration, false, $.proxy(onLoaded, this));
            }
        },

        activateView: function (view, url, scrollPosition, refresh) {

            view.active = true;
            Andamio.dom.html.addClass("has-" + view.name);

            if (url) {
                this.loadView(view, url, scrollPosition, null, refresh);
            } else {
                Andamio.dom.doc.trigger("Andamio:views:activateView:start", [view, "load", this.currentUrl]);
                Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [view, "load", this.currentUrl]);
            }
        },

        refreshView: function (view, callback) {

            view = view || this.currentView;

            if (view.url) {
                this.loadView(view, view.url, 0, callback, "refresh");
            }
        },

        deactivateView: function (view) {

            view.active = false;
            Andamio.dom.html.removeClass("has-" + view.name);
        },

        pushView: function (view, url, scrollPosition, refresh) {

            this.currentView = view;

            if (this.previousView) {
                this.previousScrollPosition = this.previousView.scrollPosition;
                this.deactivateView(this.previousView);
            }

            this.activateView(view, url, scrollPosition, refresh);
        },

        popView: function () {

            if (this.previousView) {

                // hide current
                this.deactivateView(this.currentView);

                // Delete the last view
                this.viewHistory.pop();

                // Only pop history if there's more than 1 item
                if (this.urlHistory.length > 1) {
                    this.urlHistory.pop();
                }

                // Fast path: parent view is still in the DOM, so just show it
                if (this.childCount === 1 || this.modalCount || this.mediaCount) {
                    this.activateView(this.currentView);
                } else {
                    this.activateView(this.currentView, this.currentUrl, this.previousScrollPosition);
                }

                // Finally, delete the last scroll position
                this.scrollHistory.pop();
            }
        },

        openParentPage: function (url, refresh) {

            this.resetViews();
            this.pushView(parentView, url, 0, refresh);
        },

        pushModal: function (url, refresh) {

            if (this.modalCount > 0) {
                return false;
            } else {

                if (Andamio.config.webapp) {
                    modalView.slide("slide-default");
                }

                this.pushView(modalView, url, 0, refresh);
                this.modalCount++;
            }
        },

        popModal: function () {

            if (this.modalCount > 0) {

                if (Andamio.config.webapp) {
                    modalView.slide("slide-bottom");
                }

                this.popView();
                this.modalCount--;
            } else {
                return false;
            }
        },

        pushMedia: function (url, refresh) {

            if (this.mediaCount > 0) {
                return false;
            } else {

                if (Andamio.config.webapp) {
                    mediaView.slide("slide-default");
                }

                this.pushView(mediaView, url, 0, refresh);
                this.mediaCount++;
            }
        },

        popMedia: function () {

            if (this.mediaCount > 0) {

                if (Andamio.config.webapp) {
                    mediaView.slide("slide-bottom");
                }

                this.popView();
                this.mediaCount--;
            } else {
                return false;
            }
        },

        pushChild: function (url, refresh) {

            // Don't open the same URL, instead refresh
            if (url === Andamio.views.currentUrl) {
                if (Andamio.config.webapp) {
                    $.scrollElement(this.currentView.scroller[0], 0);
                } else {
                    this.currentView.scrollPosition = 0;
                }

                return;
            }

            this.childCount++;

            switch (this.currentView) {

            // Initial situation
            case parentView:
                this.pushView(childView, url, 0, refresh);

                if (Andamio.config.webapp) {
                    parentView.slide("slide-left");
                    childView.slide("slide-default");
                }

                break;

            case childView:
                this.pushView(childViewAlt, url, 0, refresh);

                if (Andamio.config.webapp) {
                    childViewAlt.container.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function () {
                        childView.slide("slide-left");
                        childViewAlt.slide("slide-default");
                    }, 0);
                }

                break;

            case childViewAlt:
                this.pushView(childView, url, 0, refresh);

                if (Andamio.config.webapp) {
                    childView.container.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function () {
                        childViewAlt.slide("slide-left");
                        childView.slide("slide-default");
                    }, 0);
                }

                break;
            }
        },

        popChild: function () {

            var currentView = this.currentView;

            if (Andamio.config.webapp) {
                switch (currentView) {
                case parentView:
                    return; // abort!

                case childView:

                    if (this.childCount === 1) {

                        parentView.slide("slide-default");
                        childView.slide("slide-right");

                    } else {

                        childViewAlt.container.removeClass("slide-right").addClass("slide-left");

                        Andamio.util.delay(function () {
                            childView.slide("slide-right");
                            childViewAlt.slide("slide-default");
                        }, 0);
                    }

                    break;

                case childViewAlt:

                    childView.container.removeClass("slide-right").addClass("slide-left");

                    Andamio.util.delay(function () {
                        childViewAlt.slide("slide-right");
                        childView.slide("slide-default");
                    }, 0);

                    break;
                }
            }

            this.popView();
            this.childCount--;
        },

        init: function () {

            // Setup references
            var self = this,
                target,
                url;

            // Setup view variables
            parentView = this.parentView;
            childView = this.childView;
            childViewAlt = this.childViewAlt;
            modalView = this.modalView;
            mediaView = this.mediaView;

            // Kick off
            self.resetViews();

            // Load the initial view URL if set
            if (typeof Andamio.config.initialView === "string") {
                self.openParentPage(Andamio.config.initialView, null, "refresh");
            } else {
                self.openParentPage();
                self.currentUrl = Andamio.config.server;
            }

            /**
             * Setup action listeners
             */
            Andamio.events.attach(".action-push", function (event) {

                target = $(event.currentTarget),
                url = Andamio.util.getUrl(target);

                self.pushChild(url);
            }, true);

            Andamio.events.attach(".action-pop", function () {

                self.popChild();
            }, true);

            Andamio.events.attach(".action-show-modal", function (event) {

                target = $(event.currentTarget),
                url = Andamio.util.getUrl(target);

                if (Andamio.nav.status && !Andamio.config.os.tablet) Andamio.nav.hide();

                self.pushModal(url);
            }, true);

            Andamio.events.attach(".action-hide-modal", function () {

                self.popModal();
            }, true);

            Andamio.events.attach(".action-show-media", function (event) {

                target = $(event.currentTarget),
                url = Andamio.util.getUrl(target);

                if (Andamio.nav.status && !Andamio.config.os.tablet) Andamio.nav.hide();

                self.pushMedia(url);
            }, true);

            Andamio.events.attach(".action-hide-media", function () {

                self.popMedia();
            }, true);

            Andamio.events.attach(".action-refresh", function () {

                self.refreshView();
            }, true);

            // Swipe right to go back
            if (Andamio.config.webapp && Andamio.config.touch) {
                Andamio.dom.doc.on("swipeRight", ".child-view", function () {

                    self.popChild();
                });
            }
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

Andamio.init = function (options) {

    // Apply user parameters
    Andamio.config.init(options);

    // Show UI as soon as possible
    Andamio.container.init();

    // Initialize the rest
    Andamio.alert.init();
    Andamio.cache.init();
    Andamio.connection.init();
    Andamio.loader.init();

    Andamio.views.init();
    Andamio.nav.init();
    Andamio.reveal.init();
    Andamio.tabs.init();
};
