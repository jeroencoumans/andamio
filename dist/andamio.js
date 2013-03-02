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
    pagerNoMorePages: "There are no more items."
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

        get webapp() {
            return Andamio.dom.html.hasClass("webapp");
        },

        set webapp(value) {

            if (value) {
                Andamio.dom.html.removeClass("website").addClass("webapp");
            } else {
                Andamio.dom.html.removeClass("webapp").addClass("website");
            }
        },

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

            this.webapp  = win.location.search.search("webapp") > 0 || win.navigator.standalone;
            this.website = !this.webapp;
            this.cordova = win.navigator.userAgent.indexOf("TMGContainer") > -1;
            this.server  = win.location.origin + win.location.pathname;
            this.touch   = 'ontouchstart' in win;
            this.cache   = window.lscache ? window.lscache.supported() : false;

            if (Andamio.dom.doc.width() >= 980) {
                this.os.tablet = true;
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

            if (this.cache) {
                this.cacheExpiration = 120;
            }

            if (this.touch) {
                this.fastclick = new FastClick(win.document.body);
            } else {
                Andamio.dom.html.addClass("no-touch");
            }

            if (this.cordova) {
                this.webapp = true;
            }

            if (this.os.tablet) {
                Andamio.dom.html.addClass("tablet");
                Andamio.nav.show();
                this.webapp = true;
            }

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
/*global Andamio, $ */

Andamio.util = (function () {

    function forEachIn(object, action) {
        for (var property in object) {
            if (Object.prototype.hasOwnProperty.call(object, property))
                action(property, object[property]);
        }
    }

    function Dictionary(startValues) {
        this.values = startValues || {};
    }

    Dictionary.prototype.store = function (name, value) {
        this.values[name] = value;
    };

    Dictionary.prototype.lookup = function (name) {
        return this.values[name];
    };

    Dictionary.prototype.contains = function (name) {
        return Object.prototype.hasOwnProperty.call(this.values, name) &&
        Object.prototype.propertyIsEnumerable.call(this.values, name);
    };

    Dictionary.prototype.each = function (action) {
        forEachIn(this.values, action);
    };

    return {

        Dictionary: Dictionary,

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

Andamio.phone = (function () {

    return {
        init: function () {

            Andamio.config.phone = {
                updateTimestamp: new Date(),
                updateTimeout: 30 * 60 * 1000
            };

            navigator.bootstrap.addConstructor(function () {

                // hide splashscreen
                cordova.exec(null, null, "SplashScreen", "hide", []);

                // Listens to all clicks on anchor tags and opens them in Cordova popover if it's an external URL
                Andamio.events.attach('a[target="_blank"]', function (event) {

                    var target  = $(event.currentTarget),
                        href = target.attr("href");

                    navigator.utility.openUrl(href, "popover");
                    return false;
                });

                Andamio.dom.doc.on("statusbartap", function () {

                    var currentView = Andamio.views.list.lookup(Andamio.views.currentView),
                        scroller = Andamio.nav.status ? Andamio.dom.pageNav : currentView.scroller;

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
                    var now = new Date();
                    if (now - Andamio.config.updateTimestamp > Andamio.config.updateTimeout) {

                        if (Andamio.alert.status) {
                            Andamio.alert.hide();
                        }

                        Andamio.views.refreshView();
                    }
                });

                if (Andamio.config.os.android) {
                    navigator.bootstrap.addConstructor(function () {
                        Andamio.dom.doc.addEventListener("backbutton", function () {
                            Andamio.views.popChild();
                        });
                    });
                }
            });
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

/**
 * Provides methods for storing HTML documents offline
 * @author Jeroen Coumans
 * @class store
 * @namespace APP
 */
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

Andamio.page = (function () {

    function doAjaxRequest(url, expiration, callback) {

        // Cachebuster
        var requestUrl = url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();

        $.ajax({
            "url": requestUrl,
            "timeout": 0,
            "headers": {
                "X-PJAX": true,
                "X-Requested-With": "XMLHttpRequest"
            },

            error: function (xhr, type) {

                // type is one of: "timeout", "error", "abort", "parsererror"
                var status = xhr.status,
                    errorMessage = '<a href="javascript:void(0)" class="action-refresh">' + Andamio.i18n.ajaxGeneralError + '<br>' + type + " " + status + '<br>' + Andamio.i18n.ajaxRetry + '</a>';

                if (type === "timeout") {
                    Andamio.connection.goOffline();
                } else {
                    if (Andamio.connection.status) {
                        Andamio.alert.show(errorMessage);
                    }
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
        load: function (url, expiration, callback) {

            if (url) {

                var cachedContent = Andamio.cache.get(url);

                if (cachedContent) {

                    if ($.isFunction(callback)) callback(cachedContent);
                } else {

                    doAjaxRequest(url, expiration, function (response) {
                        if ($.isFunction(callback)) callback(response);
                    });
                }
            }
        },

        refresh: function (url, expiration, callback) {

            Andamio.cache.delete(url);
            this.load(url, expiration, callback);
        }
    };

})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.pager = (function () {

    var isActive,
        isAutofetching,
        isLoading,
        loadMoreAction,
        spinner,
        noMorePages,
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

        noMorePages.insertAfter(Andamio.dom.pagerWrapper);
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
        loadMoreAction  = $('<div class="pager-action"><a href="javascript:void(0)" class="button button-block action-load-more">' + (this.params.loadMoreAction || Andamio.i18n.pagerLoadMore) + '</a></div>');
        spinner         = $('<div class="pager-loading">' + (this.params.spinner || Andamio.i18n.pagerLoading) + '</div></div>');
        noMorePages     = $('<div class="pager-action">' + (this.params.noMorePages || Andamio.i18n.pagerNoMorePages) + '</div>');

        // Store options in global config
        Andamio.config.pager = {
            autoFetch           : this.params.autoFetch || false,
            autoFetchMax        : this.params.autoFetchMax || 3,
            autoFetchThreshold  : this.params.autoFetchThreshold || 100,
            callback            : $.isFunction(this.params.callback) ? this.params.callback : function () {},
            expires             : this.params.expires || null,
            itemsPerPage        : this.params.itemsPerPage || 10,
            loadMoreAction      : loadMoreAction,
            noMorePages         : noMorePages,
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
            }
        });

        // Activate
        if (Andamio.dom.pagerWrapper.length > 0) {
            if (Andamio.config.pager.itemsPerPage <= Andamio.dom.pagerWrapper[0].children.length) {
                enablePager(this);
            }
        }
    }

    Pager.prototype.loadNextPage = function (callback) {

        if (! isLoading) {

            isLoading = true;
            this.pageNumber++;

            var self = this,
                content;

            if (! self.autoFetching) {
                showSpinner();
            }

            Andamio.page.load(Andamio.config.pager.url + self.pageNumber, Andamio.config.pager.expires, function (response) {

                isLoading = false;
                content = false;

                if (response) {
                    if ($.isPlainObject(response)) {
                        if (! $.isEmptyObject(response.content)) {
                            content = response.content;
                        }
                    } else {
                        content = response;
                    }
                }

                if (content) {

                    Andamio.dom.pagerWrapper.append(content);

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

                    disablePager(self);
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

Andamio.alert = (function () {

    var isActive;

    return {
        show: function (msg) {

            if (msg) {
                Andamio.dom.pageAlertText = msg;
            }

            isActive = true;
            Andamio.dom.html.addClass("has-alert");
            Andamio.dom.pageAlert.show();
        },

        hide: function () {

            isActive = false;
            Andamio.dom.html.removeClass("has-alert");
            Andamio.dom.pageAlert.hide();
        },

        get status() {

            return isActive;
        },

        init: function () {

            isActive = Andamio.dom.html.hasClass("has-alert");
            Andamio.events.attach(".action-hide-alert", this.hide);
            Andamio.dom.doc.on("Andamio:views:activateView", this.hide);
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

            Andamio.dom.html.addClass("has-loader");

            if (Andamio.config.cordova) {
                if (navigator.spinner) {
                    navigator.spinner.show({"message": msg});
                }
            }
            else {
                Andamio.dom.pageLoader.show();
            }
        },

        hide: function () {

            isActive = false;
            Andamio.dom.html.removeClass("has-loader");

            if (Andamio.config.cordova) {
                if (navigator.spinner) {
                    navigator.spinner.hide();
                }
            }
            else {
                Andamio.dom.pageLoader.hide();
            }
        },

        get status() {

            return isActive;
        },

        init: function () {

            isActive = Andamio.dom.html.hasClass("has-loader");

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

            docheight = Andamio.dom.win.height();
            navheight = Andamio.dom.pageNav.height();

            // When in Mobile Safari, add the height of the address bar
            if (Andamio.config.os.iphone && !Andamio.config.webapp) {
                docheight += 60;
            }

            // make sure the navigation is as high as the page
            if (docheight > navheight) {
                navheight = docheight;
                Andamio.dom.pageNav.height(navheight);
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

        if (typeof number === "number") {
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
    }

    return {
        init: function (id, options, callback) {

            var slideshowContainer = $("#" + id);

            if (! slideshowContainer.hasClass(".js-slideshow-active")) {

                this.options = {
                    startSlide: 0,
                    speed: 300,
                    continuous: true,
                    disableScroll: false
                };

                // Merge user-defined options
                if (typeof options === "object" && typeof options !== "undefined") {

                    for (var key in options) {
                        this.options[key] = options[key];
                    }
                }

                // setup Swipe
                var slideshow = new Swipe(document.getElementById(id), this.options),
                    dots = new SwipeDots(slideshow.length);

                dots.wrapper
                    .insertAfter(slideshow.container)
                    .on("click", function (event) {

                    var target = event.target;

                    dots.items.each(function (index, item) {

                        if (item === target) {
                            slideshow.slide(index, 300);
                        }
                    });
                });

                // setup dots callback
                slideshow.callback = function (index, item) {

                    dots.active = dots.items[index];

                    if ($.isFunction(callback)) {
                        callback(index, item);
                    }
                };

                slideshowContainer.find(".js-slideshow-media").each(function (index, item) {

                    var img = $(item),
                        url = img.data("src");
                    img.css('background-image', 'url(' + url + ')');
                });

                slideshowContainer.on("click", function (event) {

                    var target = $(event.target),
                        isNext = target.parents(".action-slideshow-next"),
                        isPrev = target.parents(".action-slideshow-prev");

                    if (isNext.length > 0) {
                        slideshow.next();
                    }

                    if (isPrev.length > 0) {
                        slideshow.prev();
                    }
                });

                slideshowContainer.addClass("js-slideshow-active");

                return slideshow;
            }
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
            Andamio.dom.pageTabs.show();
        },

        hide: function () {
            hasTabs = false;
            Andamio.dom.html.removeClass("has-page-tabs");
            Andamio.dom.pageTabs.hide();
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
                        Andamio.dom.viewport.one("Andamio:views:activateView:finish", function () {
                            Andamio.views.list.values.parentView.title = title;
                        });
                    }

                    Andamio.views.openParentPage(url);
                }
            });
        }
    };
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

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
    function View(container, content, position) {
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

        Object.defineProperties(this, {

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

    function ViewCollection() {

        // Internally used variables
        var parentView   = new View(Andamio.dom.parentView,   true, "slide-default"),
            childView    = new View(Andamio.dom.childView,    true, "slide-right"),
            childViewAlt = new View(Andamio.dom.childViewAlt, true, "slide-right"),
            modalView    = new View(Andamio.dom.modalView,    true, "slide-bottom"),
            urlHistory = [],
            viewHistory = [],
            scrollHistory = [];

        // Public variables
        this.list = new Andamio.util.Dictionary({
            parentView:   parentView,
            childView:    childView,
            childViewAlt: childViewAlt,
            modalView:    modalView
        });

        this.childCount = 0;
        this.modalCount = 0;

        Object.defineProperties(this, {

            currentUrl: {
                get: function ()      { return last(urlHistory); },
                set: function (value) { addUniq(value, urlHistory); } // TODO: when opening the same URL in a new view, history gets messed up
            },

            previousUrl: {
                get: function ()      { return prev(urlHistory); }
            },

            currentView: {
                get: function ()      { return last(viewHistory); },
                set: function (value) { viewHistory.push(value); }
            },

            previousView: {
                get: function ()      { return prev(viewHistory); }
            },

            scrollPosition: {
                get: function ()      { return last(scrollHistory); },
                set: function (value) { scrollHistory.push(value); }
            },

        });

        this.resetViews = function () {

            this.list.each(function (value) {
                Andamio.views.list.values[value].reset();
            });

            viewHistory = [];
            urlHistory = [];
            scrollHistory = [];
            this.childCount = 0;
        };

        this.activateView = function (view, url, expiration, scrollPosition) {

            if (this.list.contains(view)) {

                var currentView = this.list.lookup(view);

                currentView.active = true;

                Andamio.dom.doc.trigger("Andamio:views:activateView");

                if (url) {

                    Andamio.dom.doc.trigger("Andamio:views:activateView:start", [url]);

                    currentView.content.empty();

                    Andamio.page.load(url, expiration, function (response) {

                        currentView.content.html(response);

                        if (typeof scrollPosition === "number") {
                            currentView.scroller[0].scrollTop = scrollPosition;
                        }

                        Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [url]);
                    });
                }
            }
        };

        this.deactivateView = function (view) {

            if (this.list.contains(view)) {

                this.list.lookup(view).active = false;
            }
        };

        this.pushView = function (view, url, expiration, scrollPosition) {

            if (this.list.contains(view)) {
                this.currentView = view;

                if (url) {
                    this.currentUrl = url;
                }

                if (this.previousView) {
                    this.scrollPosition = this.list.lookup(this.previousView).scroller[0].scrollTop;
                }

                this.activateView(view, url, expiration, scrollPosition);
                this.deactivateView(this.previousView);
            }
        };

        this.popView = function () {

            if (this.previousView) {

                // hide current
                this.deactivateView(this.currentView);

                // Fast path: parent view is still in the DOM, so just show it
                if (this.childCount === 1) {
                    this.activateView(this.previousView);
                } else {
                    this.activateView(this.previousView, this.previousUrl, false, this.scrollPosition);
                }

                // Delete the last view
                viewHistory.pop();
                urlHistory.pop();
                scrollHistory.pop();
            }
        };

        this.refreshView = function (expiration) {

            var url = this.currentUrl,
                currentView = this.list.lookup(this.currentView);

            if (url) {
                currentView.content.empty();

                Andamio.page.refresh(url, expiration, function (response) {

                    currentView.content.html(response);
                });
            }
        };

        this.openParentPage = function (url, expiration) {

            this.resetViews();

            var minutes = expiration || Andamio.config.cacheExpiration;
            this.pushView("parentView", url, minutes, 0);
        };

        this.pushModal = function (url, expiration) {

            if (this.modalCount > 0) {
                return false;
            } else {

                if (Andamio.config.webapp) {
                    modalView.slide("slide-default");
                }

                this.pushView("modalView", url, expiration);
                this.modalCount++;
            }
        };

        this.popModal = function () {

            if (this.modalCount > 0) {

                if (Andamio.config.webapp) {
                    modalView.slide("slide-bottom");
                }

                this.popView();
                this.modalCount--;
            } else {
                return false;
            }
        };

        this.pushChild = function (url, expiration) {

            this.childCount++;

            var currentView  = this.list.lookup(this.currentView);

            switch (currentView) {

            // Initial situation
            case parentView:
                this.pushView("childView", url, expiration, 0);

                if (Andamio.config.webapp) {
                    parentView.slide("slide-left");
                    childView.slide("slide-default");
                }

                break;

            case childView:
                this.pushView("childViewAlt", url, expiration, 0);

                if (Andamio.config.webapp) {
                    childViewAlt.container.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function () {
                        childView.slide("slide-left");
                        childViewAlt.slide("slide-default");
                    }, 0);
                }

                break;

            case childViewAlt:
                this.pushView("childView", url, expiration, 0);

                if (Andamio.config.webapp) {
                    childView.container.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function () {
                        childViewAlt.slide("slide-left");
                        childView.slide("slide-default");
                    }, 0);
                }

                break;
            }
        };

        this.popChild = function () {

            var currentView  = this.list.lookup(this.currentView);

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
        };

        this.init = function () {

            if (typeof Andamio.config.initialView === "string") {
                Andamio.views.openParentPage(Andamio.config.initialView);
            } else {
                Andamio.views.openParentPage();
                Andamio.views.currentUrl = Andamio.config.server;
            }

            /**
             * Setup action listeners
             */
            Andamio.events.attach(".action-push", function (event) {

                var target = $(event.currentTarget),
                    url = Andamio.util.getUrl(target);

                Andamio.views.pushChild(url);
            });

            Andamio.events.attach(".action-show-modal", function (event) {

                var target = $(event.currentTarget),
                    url = Andamio.util.getUrl(target);

                Andamio.views.pushModal(url);
            });

            Andamio.events.attach(".action-pop", function () {

                Andamio.views.popChild();
            });

            Andamio.events.attach(".action-hide-modal", function () {

                Andamio.views.popModal();
            });

            Andamio.events.attach(".action-refresh", function () {

                Andamio.views.refreshView();
            });
        };
    }

    return new ViewCollection();
})();

/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

/**
 * Core module for initializing capabilities and modules
 * @author Jeroen Coumans
 * @class init
 * @namespace APP
 */
Andamio.init = function (options) {

    // Apply user parameters
    Andamio.config.init(options);

    // Initialize the rest
    Andamio.alert.init();
    Andamio.cache.init();
    Andamio.connection.init();
    Andamio.loader.init();

    Andamio.views.init();
    Andamio.nav.init();
    Andamio.tabs.init();
    Andamio.reveal.init();

    if (Andamio.config.cordova) {
        Andamio.phone.init();
    }
};
