/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

window.Andamio = {};

Andamio.dom = (function () {

    return {
        win:            $(window),
        doc:            $(window.document),
        html:           $("html"),
        viewport:       $(".viewport"),

        pageView:       $(".js-page-view"),
        parentView:     $(".js-parent-view"),
        childView:      $(".js-child-view"),
        childViewAlt:   $(".js-child-view-alternate"),
        modalView:      $(".js-modal-view")
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

Andamio.i18n = {
    ajaxGeneralError: "Computer said no:",
    ajaxNotFound: "The page couldn't be found.",
    ajaxTimeout: "The server timed out waiting for the request.",
    ajaxServerError: "The server is having problems, try again later.",
    ajaxRetry: "Please go back or try again.",
    offlineMessage: "There was a problem. Is your connection working? <br>Please check and try again.",
    pagerLoadMore: "Load more",
    pagerLoading: "Loading&hellip;",
    pagerNoMorePages: "There are no more items.",
    relativeDates: {
        ago: 'ago',
        from: '',
        now: 'Just now',
        minute: 'Minute',
        minutes: 'Minutes',
        hour: 'Hour',
        hours: 'Hours',
        day: 'Day',
        days: 'Days',
        week: 'Week',
        weeks: 'Weeks',
        month: 'Month',
        months: 'Months',
        year: 'Year',
        years: 'Years'
    }
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

            if (Andamio.dom.doc.width() >= 980) {
                this.os.tablet = true;
            }

            if (this.cache) {
                this.cacheExpiration = 120;
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

        attach: function (selector, fn, lock) {

            Andamio.dom.viewport.on("click", selector, function (event) {

                if (! isLocked) {

                    if (lock) {
                        Andamio.events.lock();
                    }

                    fn(event);
                }

                return false;
            });
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $, humaneDate */

Andamio.util = (function () {

    return {

        /*
         * Get URL from the data attribute, falling back to the href
         * @method getUrl
         * @param {HTMLElement} elem the element to get the URL from
         * @return {String} Will return the URL when a `data-url` value is found, else return the href if an href is found that doesn't start with `javascript`, else return the hash if hash is found
         */
        getUrl: function (elem) {

            var url = $(elem).data("url"),
                href = $(elem).attr("href"),
                hash = $(elem).hash;

            if (url) {
                return encodeURI(url);
            }

            else if (href.substring(0, 10) !== "javascript") {
                return encodeURI(href);
            }

            else if (hash) {
                return encodeURIComponent(hash);
            }
        },

        /**
         * Returns an array of URL's
         * @method getUrlList
         * @param {Array} array the selector used to get the DOM elements, e.g. ".article-list .action-pjax"
         * @return {Array} an array of URL's
         */
        getUrlList: function (list) {

            if (! list) {
                return;
            }

            var urlList = [];

            $(list).each(function (index, item) {

                var url = Andamio.util.getUrl(item);
                if (url) urlList.push(url);
            });

            return urlList;
        },

        /**
         * Get title from the data attribute, falling back to the text
         * @method getTitle
         * @param {HTMLElement} elem the element to get the title from
         * @return {String} the value of `data-title` if it's found, else the text of the element
         */
        getTitle: function (elem) {

            var titleData = $(elem).data("title"),
                titleText = $(elem).text();

            return titleData ? titleData : titleText;
        },

        relativeDate: function (value) {

            if (value instanceof Date) {

                return humaneDate(value, false, {
                    lang: Andamio.i18n.relativeDates
                });
            }
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
/*global Andamio, $, cordova */

Andamio.container = (function () {

    var scroller, now,

    initContainer = function () {

        Andamio.config.phone = {
            updateTimestamp: new Date(),
            updateTimeout: 30 * 60 * 1000
        };

        // hide splashscreen
        cordova.exec(null, null, "SplashScreen", "hide", []);

        // Listens to all clicks on anchor tags and opens them in Cordova popover if it's an external URL
        Andamio.events.attach('.action-external', function (event) {

            var target  = $(event.currentTarget),
                href = target.attr("href");

            if (navigator.utility && navigator.utility.openUrl) {
                navigator.utility.openUrl(href, "popover");
            }
        });

        Andamio.dom.doc.on("statusbartap", function () {

            scroller = Andamio.nav.status ? Andamio.dom.pageNav : Andamio.views.currentView.scroller;

            if ($.scrollTo) {
                scroller.scrollTo(0, 400);
            } else if ($.scrollElement) {
                $.scrollElement(scroller[0], 0);
            }
        });

        // refresh when application is activated from background
        Andamio.dom.doc.on("resign", function () {
            Andamio.config.phone.updateTimestamp = new Date();
        });

        Andamio.dom.doc.on("active", function () {

            now = new Date();

            if (now - Andamio.config.phone.updateTimestamp > Andamio.config.phone.updateTimeout) {

                if (Andamio.alert.status) {
                    Andamio.alert.hide();
                }

                if (Andamio.views.currentView === Andamio.views.parentView) {
                    Andamio.views.refreshView();
                }
            }
        });
    };

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
                var minutes = (typeof expiration === "number") ? expiration : Andamio.config.cacheExpiration;
                cache.set(key, data, minutes);
            }
        },

        delete: function (key) {

            if (key && cache) {
                cache.remove(key);
            }
        },

        init: function () {

            if (Andamio.config.cache) {

                cache = window.lscache;
                Andamio.config.cacheExpiration = 120;
            } else {
                cache = false;
            }
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.connection = (function () {

    var isOnline;

    return {

        goOnline: function () {
            isOnline = true;
            Andamio.alert.hide();
        },

        goOffline: function () {

            if (!!isOnline) {
                isOnline = false;

                var offlineMessage = $('<a href="javascript:void(0)" class="action-refresh">' + Andamio.i18n.offlineMessage + '</a>');
                Andamio.alert.show(offlineMessage);
            }
        },

        get status() {
            return isOnline;
        },

        init: function () {

            isOnline = navigator.onLine;
        }
    };

})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.dom.refreshDate = $(".js-refresh-date");

Andamio.page = (function () {

    var updateTimestamp, updateTimer;

    function doAjaxRequest(url, expiration, cache, callback) {

        $.ajax({
            url: url,
            cache: cache,
            headers: {
                "X-PJAX": true,
                "X-Requested-With": "XMLHttpRequest"
            },

            error: function (xhr, type) {

                // type is one of: "timeout", "error", "abort", "parsererror"
                var status = xhr.status,
                    errorMessage = '<a href="javascript:void(0)" class="action-refresh">' + Andamio.i18n.ajaxGeneralError + '<br>' + type + " " + status + '<br>' + Andamio.i18n.ajaxRetry + '</a>';

                switch(type) {

                case "timeout":
                    Andamio.connection.goOffline();
                    break;
                case "error":
                    if (Andamio.connection.status) {
                        Andamio.alert.show(errorMessage);
                    }
                    break;
                }
            },

            success: function (response) {
                Andamio.connection.goOnline();
                Andamio.cache.set(url, response, expiration);
                callback(response);
            }
        });
    }

    return {
        get lastUpdate() {
            return updateTimestamp;
        },

        set lastUpdate(date) {

            updateTimestamp = (date instanceof Date) ? date : new Date();
            Andamio.dom.refreshDate.text(Andamio.util.relativeDate(updateTimestamp));
        },

        load: function (url, expiration, cache, callback) {

            clearInterval(updateTimer);

            var self = this,
                doCallback = function (response) {

                if (Andamio.dom.refreshDate.length > 0) {
                    updateTimer = window.setInterval(function () {
                        Andamio.dom.refreshDate.text(Andamio.util.relativeDate(self.lastUpdate));
                    }, 60000);
                }

                if ($.isFunction(callback)) callback(response);
            };

            if (url) {

                var cachedContent = Andamio.cache.get(url);

                if (cachedContent) {

                    self.lastUpdate = new Date(localStorage.getItem("lscache-" + url + "-cacheexpiration") * 60000 - (60000 * Andamio.config.cacheExpiration));
                    doCallback(cachedContent);
                } else {

                    doAjaxRequest(url, expiration, cache, function (response) {

                        self.lastUpdate = new Date();
                        doCallback(response);
                    });
                }
            }
        },

        refresh: function (url, expiration, callback) {

            Andamio.cache.delete(url);
            this.load(url, expiration, false, callback);
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
        url                 : Andamio.config.server + "?page=" // URL that should be loaded. The pageNumber is automatically appended
    })

 **/

Andamio.pager = (function () {

    function Pager(params) {

        // Private variables
        this.loadMoreAction = $('<div class="pager-action"><a href="javascript:void(0)" class="button button-block action-load-more">' + Andamio.i18n.pagerLoadMore + '</a></div>');
        this.spinner        = $('<div class="pager-loading display-none"><i class="icon icon-spinner-light"></i><span class="icon-text">' + Andamio.i18n.pagerLoading + '</span></div>');
        this.noMorePages    = $('<div class="pager-action" display-none>' + Andamio.i18n.pagerNoMorePages + '</div>');
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
        this.spinner.removeClass("display-none");
        this.loadMoreAction.addClass("display-none");
    };

    Pager.prototype.hideSpinner = function () {
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

        var scrollTop = Andamio.config.webapp ? this.scroller.scrollTop() : Andamio.dom.viewport.scrollTop();

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

        // Show the message that there are no more pages
        this.noMorePages.insertAfter(this.options.pagerWrapper);

        if (this.options.autoFetch) {
            this.disableAutofetch();
        }
    };

    Pager.prototype.loadNextPage = function (callback) {

        if (this.loading || ! this.status) return;

        this.loading = true;
        this.options.pageNumber++;

        if (! this.options.autoFetch) this.showSpinner();

        var self = this;

        Andamio.page.load(this.options.url + this.options.pageNumber, this.options.expires, true, function (response) {

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

            // Done loading
            self.loading = false;
            if (! self.options.autoFetch) self.hideSpinner();

            // if less children than items per page are returned, disable the pager
            if (self.options.pagerWrapper.children().length - children < self.options.itemsPerPage) {
                self.disable();
            }

            self.updateScroller();
            if ($.isFunction(callback)) callback(self.options.pageNumber);
            if ($.isFunction(self.options.callback)) self.options.callback(self.options.pageNumber);
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
                url                 : Andamio.config.server + "?page="
            };

            $.extend(options, params);

            return new Pager(options);
        }
    };

})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */
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

/**
 * Controls global alerts
 * @author Jeroen Coumans
 * @class alert
 * @namespace Andamio
 */
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

            isActive = false;
            Andamio.events.attach(".action-hide-alert", this.hide);
            Andamio.dom.doc.on("Andamio:views:activateView:start", this.hide);
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

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

            if (msg) {
                Andamio.dom.pageLoaderText = msg;
            }

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

            isActive = false;

            var self = this,
                timeoutToken;

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

            Andamio.dom.doc.on("touchmove", ".action-hide-nav", function (event) {
                event.preventDefault();
            });

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

    var isActive,
        isLoading,
        scrollTop,
        options;

    function onTouchStart() {

        // store the scrollTop to determine if we need to set a timeout or not
        scrollTop = options.scroller[0].scrollTop;
    }

    function onTouchMove() {

        // don't bother doing anything if the stored scrollTop wouldn't result in an actual PTR
        if (scrollTop > options.offset) return;

        scrollTop = options.scroller[0].scrollTop;

        if (scrollTop < options.threshold) {

            options.scroller.addClass("can-refresh");
        } else {

            options.scroller.removeClass("can-refresh");
        }
    }

    function onRefreshEnd() {

        isLoading = false;
        options.scroller.removeClass("is-refreshing");
        options.callback();
    }

    function onTouchEnd() {

        if (scrollTop > options.offset) return;

        scrollTop = options.scroller[0].scrollTop;

        if (scrollTop < options.threshold) {

            isLoading = true;
            options.scroller.addClass("is-refreshing").removeClass("can-refresh");
            Andamio.views.currentView.content[0].innerHTML = "";
            Andamio.loader.show();

            // Set a hardcoded delay to actually refresh, since it sometimes happens so fast it causes a jarring experience
            Andamio.util.delay(function () {
                Andamio.views.refreshView(null, onRefreshEnd);
            }, 300);
        }
    }

    return {

        get status() {
            return isActive;
        },

        get loading() {
            return isLoading;
        },

        get options() {

            return options;
        },

        enable: function () {

            isActive = true;
            options.scroller.addClass("has-pull-to-refresh")
                .on("touchmove", onTouchMove)
                .on("touchstart", onTouchStart)
                .on("touchend", onTouchEnd);
        },

        disable: function () {

            isActive = false;
            options.scroller.removeClass("has-pull-to-refresh")
                .off("touchmove", onTouchMove)
                .off("touchstart", onTouchStart)
                .off("touchend", onTouchEnd);
        },

        init: function (params) {

            isActive = false;

            // By default, we set the pull to refresh on the parentView
            options = {
                scroller  : Andamio.views.parentView.scroller,
                callback  : function () {},
                threshold : -50,
                offset    : 150
            };

            $.extend(options, params);

            this.enable();
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

        this.wrapper.find(".action-slideshow-next").on("click", this.slideshow.next);
        this.wrapper.find(".action-slideshow-prev").on("click", this.slideshow.prev);
    }

    Slideshow.prototype.destroy = function () {

        this.slideshow.kill();
        this.dots.wrapper.off("click").remove();

        // needs to go last
        this.wrapper.find(".action-slideshow-next").off("click", this.slideshow.next);
        this.wrapper.find(".action-slideshow-prev").off("click", this.slideshow.prev);
        this.wrapper.find(".slideshow-container").css("width", "");
    };

    return {

        init: function (id, params, callback) {

            return new Slideshow(id, params, callback);
        }
    };

})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

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

            hasTabs = Andamio.dom.html.hasClass("has-page-tabs");

            Andamio.events.attach(".action-show-tabs", Andamio.tabs.show);
            Andamio.events.attach(".action-hide-tabs", Andamio.tabs.hide);

            Andamio.events.attach(".action-tab-item", function (event) {

                var target  = $(event.currentTarget),
                    url     = Andamio.util.getUrl(target),
                    title   = Andamio.util.getTitle(target);

                if (Andamio.dom.pageTabsActive[0] !== target[0]) {

                    Andamio.dom.pageTabsActive = target;

                    if (title) {
                        Andamio.views.parentView.title = title;
                    }

                    Andamio.views.openParentPage(url);
                } else {

                    if (Andamio.views.currentView !== Andamio.views.parentView) {
                        Andamio.views.openParentPage(url);
                    }
                }
            });
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

/*** TODO: add support for data-title ***/

Andamio.views = (function () {

    function last(list) {
        if (list.length > 0) {
            return list[list.length - 1];
        }
    }

    function prev(list) {
        if (list && list.length > 1) {
            return list[list.length - 2];
        }
    }

    function addUniq(value, list) {
        if (value !== last(list)) {
            list.push(value);
        }
    }

    /**
     * A view has a container, optional content and position
     */
    function View(container, position) {
        this.container = container;

        Object.defineProperties(this, {
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
            }
        });

        if (position) {
            this.initialPosition = position;
            this.position = position;

            /**
             * Slide the view based on the current position and the desired direction. Used only in webapp.
             * @method slide
             * @param direction {String} direction to which the view should slide
             */
            this.slide = function (direction) {
                var container = this.container,
                    position = this.position;

                Andamio.events.lock();

                // Slide in from the left
                if (position === "slide-left" && direction === "slide-default") {
                    container.addClass("slide-in-from-left").one("webkitTransitionEnd", function () {
                        container.addClass("slide-default").removeClass("slide-left slide-right slide-in-from-left");
                    });
                }

                // Slide in from the right
                if (position === "slide-right" && direction === "slide-default") {
                    container.addClass("slide-in-from-right").one("webkitTransitionEnd", function () {
                        container.addClass("slide-default").removeClass("slide-right slide-left slide-in-from-right");
                    });
                }

                // Slide in from the bottom
                if (position === "slide-bottom" && direction === "slide-default") {
                    container.addClass("slide-in-from-bottom").one("webkitTransitionEnd", function () {
                        container.addClass("slide-default").removeClass("slide-bottom slide-in-from-bottom");
                    });
                }

                // Slide in from the top
                if (position === "slide-top" && direction === "slide-default") {
                    container.addClass("slide-in-from-top").one("webkitTransitionEnd", function () {
                        container.addClass("slide-default").removeClass("slide-top slide-in-from-top");
                    });
                }

                // Slide out to the left
                if (position === "slide-default" && direction === "slide-left") {
                    container.addClass("slide-out-to-left").one("webkitTransitionEnd", function () {
                        container.addClass("slide-left").removeClass("slide-default slide-out-to-left");
                    });
                }

                // Slide out to the right
                if (position === "slide-default" && direction === "slide-right") {
                    container.addClass("slide-out-to-right").one("webkitTransitionEnd", function () {
                        container.addClass("slide-right").removeClass("slide-default slide-out-to-right");
                    });
                }

                // Slide out to the bottom
                if (position === "slide-default" && direction === "slide-bottom") {
                    container.addClass("slide-out-to-bottom").one("webkitTransitionEnd", function () {
                        container.addClass("slide-bottom").removeClass("slide-default slide-out-to-bottom");
                    });
                }

                // Slide out to the top
                if (position === "slide-default" && direction === "slide-top") {
                    container.addClass("slide-out-to-top").one("webkitTransitionEnd", function () {
                        container.addClass("slide-top").removeClass("slide-default slide-out-to-top");
                    });
                }

                // update positions
                this.position = direction;
            };
        }
    }

    /**
     * Resets the view to its original state
     */
    View.prototype.reset = function () {

        if (this.position && Andamio.config.webapp) {

            this.position = this.initialPosition;
            this.container
                .removeClass("slide-left slide-right slide-default slide-bottom")
                .addClass(this.position);
        }

        this.active = false;
    };

    var parentView,
        childView,
        childViewAlt,
        modalView;

    return {

        parentView   : new View(Andamio.dom.parentView,   "slide-default"),
        childView    : new View(Andamio.dom.childView,    "slide-right"),
        childViewAlt : new View(Andamio.dom.childViewAlt, "slide-right"),
        modalView    : new View(Andamio.dom.modalView,    "slide-bottom"),

        urlHistory   : [],
        viewHistory  : [],
        scrollHistory: [],

        childCount   : 0,
        modalCount   : 0,

        get currentUrl()        { return last(this.urlHistory); },
        set currentUrl(val)     { addUniq(val, this.urlHistory); }, // TODO: when opening the same URL in a new view, history gets messed up

        get previousUrl()       { return prev(this.urlHistory); },
        get currentView()       { return last(this.viewHistory); },
        set currentView(val)    { this.viewHistory.push(val); },
        get previousView()      { return prev(this.viewHistory); },

        get scrollPosition()    { return last(this.scrollHistory); },
        set scrollPosition(val) { this.scrollHistory.push(val); },

        resetViews: function () {

            this.parentView.reset();
            this.childView.reset();
            this.childViewAlt.reset();
            this.modalView.reset();

            this.viewHistory = [];
            this.urlHistory = [];
            this.scrollHistory = [];
            this.childCount = 0;
            this.modalCount = 0;
        },

        activateView: function (view, url, expiration, scrollPosition) {

            view.active = true;

            if (url) {

                var self = this;
                view.content[0].innerHTML = "";
                Andamio.dom.doc.trigger("Andamio:views:activateView:start", [view, "load", url]);

                Andamio.page.load(url, expiration, true, function (response) {

                    view.content[0].innerHTML = response;
                    self.currentUrl = url;

                    if (typeof scrollPosition === "number") {
                        view.scroller[0].scrollTop = scrollPosition;
                    }

                    Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [view, "load", url]);
                });
            }
        },

        deactivateView: function (view) {

            view.active = false;
        },

        pushView: function (view, url, expiration, scrollPosition) {

            this.currentView = view;

            if (this.previousView) {
                this.scrollPosition = this.previousView.scroller[0].scrollTop;
                this.deactivateView(this.previousView);
            }

            this.activateView(view, url, expiration, scrollPosition);
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
                if (this.childCount === 1) {
                    this.activateView(this.currentView);
                } else {
                    this.activateView(this.currentView, this.currentUrl, false, this.scrollPosition);
                }

                // Finally, delete the last scroll position
                this.scrollHistory.pop();
            }
        },

        refreshView: function (expiration, callback) {

            var url = this.currentUrl,
                currentView = this.currentView,
                currentViewContent = currentView.content[0];

            if (url) {

                currentViewContent.innerHTML = "";
                Andamio.dom.doc.trigger("Andamio:views:activateView:start", [currentView, "refresh", url]);

                Andamio.page.refresh(url, expiration, function (response) {

                    currentViewContent.innerHTML = response;
                    Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [currentView, "refresh", url]);

                    if ($.isFunction(callback)) {
                        callback();
                    }
                });
            }
        },

        openParentPage: function (url, expiration) {

            this.resetViews();
            this.pushView(parentView, url, expiration, 0);
        },

        pushModal: function (url, expiration) {

            if (this.modalCount > 0) {
                return false;
            } else {

                if (Andamio.config.webapp) {
                    this.modalView.slide("slide-default");
                }

                this.pushView(this.modalView, url, expiration, 0);
                this.modalCount++;
            }
        },

        popModal: function () {

            if (this.modalCount > 0) {

                if (Andamio.config.webapp) {
                    this.modalView.slide("slide-bottom");
                }

                this.popView();
                this.modalCount--;
            } else {
                return false;
            }
        },

        pushChild: function (url, expiration) {

            this.childCount++;

            switch (this.currentView) {

            // Initial situation
            case parentView:
                this.pushView(childView, url, expiration, 0);

                if (Andamio.config.webapp) {
                    parentView.slide("slide-left");
                    childView.slide("slide-default");
                }

                break;

            case childView:
                this.pushView(childViewAlt, url, expiration, 0);

                if (Andamio.config.webapp) {
                    childViewAlt.container.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function () {
                        childView.slide("slide-left");
                        childViewAlt.slide("slide-default");
                    }, 0);
                }

                break;

            case childViewAlt:
                this.pushView(childView, url, expiration, 0);

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

            var self = this,
                target,
                url;

            parentView = this.parentView;
            childView = this.childView;
            childViewAlt = this.childViewAlt;
            modalView = this.modalView;
            self.resetViews();

            if (typeof Andamio.config.initialView === "string") {
                self.openParentPage(Andamio.config.initialView);
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

            Andamio.events.attach(".action-show-modal", function (event) {

                target = $(event.currentTarget),
                url = Andamio.util.getUrl(target);

                if (Andamio.nav.status) Andamio.nav.hide();

                self.pushModal(url);
            }, true);

            Andamio.events.attach(".action-pop", function () {

                self.popChild();
            }, true);

            Andamio.events.attach(".action-hide-modal", function () {

                self.popModal();
            }, true);

            Andamio.events.attach(".action-refresh", function () {

                self.refreshView();
            }, true);
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

    if (Andamio.config.webapp) {
        Andamio.tabs.init();
    }
};
