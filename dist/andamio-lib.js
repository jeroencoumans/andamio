/*jshint latedef:true, undef:true, unused:false boss:true */
/*global $, document, window */

var APP = APP || {};


/**
 * Module for accessing all Andamio DOM elements
 * @author Jeroen Coumans
 * @class dom
 * @namespace APP
 */
APP.dom = (function () {

    var doc = $(document),
        win = window,
        html = $("html"),
        viewport = $(".viewport"),

        // page wrapper
        pageView = $("#page-view"),

        // parent view
        parentView = $("#parent-view"),
        parentViewTitle = parentView.find(".js-title"),
        parentViewContent = parentView.find(".js-content"),

        // child view
        childView = $("#child-view"),
        childViewTitle = childView.find(".js-title"),
        childViewContent = childView.find(".js-content"),

        // alternate child view
        childViewAlt = $("#child-view-alternate"),
        childViewAltTitle = childViewAlt.find(".js-title"),
        childViewAltContent = childViewAlt.find(".js-content"),

        // modal view
        modalView = $("#modal-view"),
        modalViewTitle = modalView.find(".js-title"),
        modalViewContent = modalView.find(".js-content"),

        // navigation
        pageNav = $("#page-navigation"),
        pageNavItems = pageNav.find(".action-nav-item"),
        pageNavActive = pageNavItems.filter(".active"),

        // loader
        pageLoader = $("#loader"),
        pageLoaderImg = pageLoader.find("img"),

        // tabs
        pageTabs = $("#page-tabs"),
        pageTabItems = pageTabs.find(".action-tab-item"),
        pageTabActive = pageTabItems.filter(".active"),

        // alert
        pageAlert = $("#page-alert");

    return {
        win: win,
        doc: doc,
        html: html,
        viewport: viewport,
        pageView: pageView,
        parentView: parentView,
        parentViewTitle: parentViewTitle,
        parentViewContent: parentViewContent,
        childView: childView,
        childViewTitle: childViewTitle,
        childViewContent: childViewContent,
        childViewAlt: childViewAlt,
        childViewAltTitle: childViewAltTitle,
        childViewAltContent: childViewAltContent,
        modalView: modalView,
        modalViewTitle: modalViewTitle,
        modalViewContent: modalViewContent,
        pageNav: pageNav,
        pageNavItems: pageNavItems,
        pageNavActive: pageNavActive,
        pageLoader: pageLoader,
        pageLoaderImg: pageLoaderImg,
        pageTabs: pageTabs,
        pageTabItems: pageTabItems,
        pageTabActive: pageTabActive,
        pageAlert: pageAlert
    };

})();

/*jshint latedef:true, undef:true, unused:true boss:true */
/*global APP, $, navigator, lscache */

/**
 * Core module for initializing capabilities and modules
 * @author Jeroen Coumans
 * @class core
 * @namespace APP
 */
APP.config = (function () {

    /*
     * Included from Zepto detect.js
     * @method detect
     * @param {Object} navigator
     * @private
     */
    function detect(ua) {

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
        os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 || chrome || firefox));
    }

    /**
     * Initialize capabilities based on UA detection
     * @method init
     */
    function init(params) {

        detect.call($, navigator.userAgent);

        if (typeof params !== "object" || typeof params === "undefined") params = false;

        // basic ios detection
        $.os.ios5 = $.os.ios && $.os.version.indexOf("5.") !== -1;
        $.os.ios6 = $.os.ios && $.os.version.indexOf("6.") !== -1;

        // basic android detection
        $.os.android2 = $.os.android && $.os.version >= "2" && $.os.version < "4"; // yes we also count android 3 as 2 ;-)
        $.os.android4 = $.os.android && $.os.version >= "4" && $.os.version < "5";

        // basic blackberry detection
        $.os.bb10 = navigator.userAgent.indexOf("BB10") > -1;

        // Enable for phone & tablet
        APP.config.ftfastclick = $.os.phone || $.os.tablet;

        // Configurable settings
        APP.config.cordova  = (typeof params.cordova !== "undefined") ? params.cordova : navigator.userAgent.indexOf("TMGContainer") > -1;
        APP.config.offline  = (typeof params.offline !== "undefined") ? params.offline : lscache.supported();
        APP.config.server   = (typeof params.server  !== "undefined") ? params.server  : APP.dom.win.location.origin + APP.dom.win.location.pathname;

        if (typeof params.webapp !== "undefined") {
            APP.config.webapp   = params.webapp;
        } else {
            APP.config.webapp = APP.config.cordova || APP.util.getQueryParam("webapp", false) === "1" || navigator.standalone;
        }

        APP.config.touch = 'ontouchstart' in APP.dom.win;

        // Yes, everything above 980 is considered desktop
        APP.config.tablet = $.os.tablet || APP.dom.doc.width() >= 980;

        if (APP.config.tablet) {
            APP.dom.html.removeClass("website").addClass("desktop has-navigation");
            APP.config.webapp = true;
        }

        if (! APP.config.touch) APP.dom.html.addClass("no-touch");

        // When used as standalone app or springboard app
        if (APP.config.webapp) APP.dom.html.removeClass("website").addClass("webapp");
        if ($.os.ios)          APP.dom.html.addClass("ios");
        if ($.os.ios5)         APP.dom.html.addClass("ios5");
        if ($.os.ios6)         APP.dom.html.addClass("ios6");
        if ($.os.android)      APP.dom.html.addClass("android");
        if ($.os.android2)     APP.dom.html.addClass("android2");
        if ($.os.android4)     APP.dom.html.addClass("android4");
    }

    return {
        "init": init
    };
})();

/**
 * Module for dealing with events, esp. preventing click events to happen multiple times during animation or while content is loading.
 * @author Jeroen Coumans
 * @class events
 * @namespace APP
 */
APP.events = (function () {

    // declare variables
    var EVENT_LOCK_TIMEOUT,
        EVENT_LOCK_LOCKED,
        EVENT_LOCK_UNLOCKED,
        eventLock,
        body;

    /**
     * Enable or disables the event lock. The event lock prevents double tapping during animation.
     * @method setEventLock
     * @param {Boolean} lock Whether to lock or unlock events: `EVENT_LOCK_LOCKED` or `EVENT_LOCK_UNLOCKED`
     * @param {Integer} timeout The timeout before the lock will automatically unlock.
     * Set to 0 to disable
     */
    function setEventLock(lock, timeout) {

        eventLock = lock;
        if (eventLock === EVENT_LOCK_LOCKED && timeout !== 0) {
            setTimeout(function () {
                eventLock = EVENT_LOCK_UNLOCKED;
            }, timeout || EVENT_LOCK_TIMEOUT);
        }
    }

    /**
     * Locks all click events
     * @method lock
     * @param {Integer} timeout Optional timeout before lock will automatically unlock.
     * Default is 500ms, set to 0 to disable
     */
    function lock(timeout) {

        setEventLock(EVENT_LOCK_LOCKED, timeout);
    }

    /**
     * Unlocks click events lock
     * @method unlock
     */
    function unlock() {

        setEventLock(EVENT_LOCK_LOCKED);
    }

    /**
     * @method isLocked
     * @return {Boolean} Whether click events are currently locked
     */
    function isLocked() {

        return  eventLock === EVENT_LOCK_LOCKED;
    }

    /**
     * Attaches a 'click' handler to elements with the given
     * selector. Will use 'tap' events if supported by the browser.
     *
     * @method attachClickHandler
     * @param {String} selector element selector
     * @param {Function} fn the function to call when clicked
     * @param {Boolean} [bubbles] Whether the event will bubble up. Default: false
     */
    function attachClickHandler(selector, fn, bubbles) {

        body.on("click", selector, function(event) {
            if (!APP.events.isLocked()) {
                fn(event);
                if (bubbles !== true) {
                    return false;
                }
            }
        });
    }

    /**
     * Initialize variables and ftFastClick
     * @method init
     */
    function init() {

        // initialize variables
        EVENT_LOCK_TIMEOUT = 500,
        EVENT_LOCK_LOCKED = true,
        EVENT_LOCK_UNLOCKED = false,

        eventLock = EVENT_LOCK_UNLOCKED,

        body = $(document.body);

        if (APP.config.ftfastclick) {
            var fastclick = new FastClick(document.body);
        }
    }

    return {
        "init": init,
        "lock": lock,
        "unlock": unlock,
        "isLocked": isLocked,
        "attachClickHandler": attachClickHandler
    };
})();

/**
 * Various utility functions
 * @author Jeroen Coumans
 * @class util
 * @namespace APP
 */
APP.util = (function () {

    /**
     * Returns the value for a given query string key.
     * @method getQueryParam
     * @todo It would be better to parse the query string once and cache the result.
     *
     * @param {String} name Query string key
     * @param {String} defaultValue If the query string is not found it returns this value.
     * @param {String} queryString Query string to pick the value from, if none is provided
     *                    window.location.search query string will be used. This
     *                    parameter makes the function testable.
     *
     * @return The value of the query string or defaultValue if the key is
     *         not found. If the value is empty an empty string is returned.
     */
    function getQueryParam(name, defaultValue, queryString) {

        if (!queryString) {
            queryString = window.location.search;
        }
        var match = RegExp("[?&]" + name + "=([^&]*)").exec(queryString);

        return match ?
            decodeURIComponent(match[1].replace(/\+/g, " "))
            : defaultValue;
    }

    /**
     * Returns whether the given (anchor) element contains an external link
     * @method isExternalLink
     * @param {HTMLElement} elem an anchor element
     * @return {Boolean} true when the anchor contains `target="_blank"`
     */
    function isExternalLink(elem) {

        var element = $(elem);

        return element.attr("target") === "_blank";
    }

    /**
     * Get URL from the data attribute, falling back to the href
     * @method getUrl
     * @param {HTMLElement} elem the element to get the URL from
     * @return {String} Will return the URL when a `data-url` value is found, else return the href if an href is found that doesn't start with `javascript`, else return the hash if hash is found
     */
    function getUrl(elem) {

        var url = $(elem).data("url"),
            href = $(elem).attr("href"),
            hash = $(elem).hash;

        if (url) { return url; }
        else if (href.substring(0,10) !== "javascript") { return href; }
        else if (hash) { return hash; }
    }

    /**
     * Returns an array of URL's
     * @method getUrlList
     * @param {HTMLElement} selector the selector used to get the DOM elements, e.g. ".article-list .action-pjax"
     * @return {Array} an array of URL's
     */
    function getUrlList(selector) {

        if (! selector) return;

        var urlList = [];

        $(selector).each(function(index, item) {

            var url = APP.util.getUrl(item);
            urlList.push(url);
        });

        return urlList;
    }

    /**
     * Get title from the data attribute, falling back to the text
     * @method getTitle
     * @param {HTMLElement} elem the element to get the title from
     * @return {String} the value of `data-title` if it's found, else the text of the element
     */
    function getTitle(elem) {

        var title;

        if (elem.data("title")) {
            title = elem.data("title");
        } else if (elem.text()) {
            title = elem.text();
        }

        return title;
    }

    return {
        "getQueryParam": getQueryParam,
        "isExternalLink": isExternalLink,
        "getUrl": getUrl,
        "getUrlList": getUrlList,
        "getTitle": getTitle
    };
})();

/**
 * Executes the callback function after a specified delay
 * @author Jeroen Coumans
 * @class delay
 * @namespace APP
 * @param {Integer} timer the delay in milliseconds after which to execute the callback
 */
APP.delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();
/*jshint latedef:true, undef:true, unused:true, boss:true */
/*global APP, $, navigator, cordova */

/**
 * Module that enhances the webapp with Cordova functionality
 * @author Jeroen Coumans
 * @class phone
 * @namespace APP
 */
APP.phone = (function () {

    var APP_FROM_BACKGROUND_REFRESH_TIMEOUT = 30 * 60 * 1000,
        lastUpdated = new Date();

    /**
     * Attach Cordova listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Listens to all clicks on anchor tags and opens them in Cordova popover if it's an external URL
        APP.dom.viewport.on("click", "a", function() {
            if (APP.util.isExternalLink(this)) {

                // open external URL's in in-app Cordova browser
                var href = $(this).attr("href");
                navigator.utility.openUrl(href, "popover");
                return false;
            } else {
                return true;
            }
        });

        // hide splashscreen
        navigator.bootstrap.addConstructor(function() {
            cordova.exec(null, null, "SplashScreen", "hide", []);
        });

        // scroll to top on tapbar tap
        APP.dom.doc.on("statusbartap", function() {

            var pageScroller = APP.nav.status() ? APP.dom.pageNav : APP.views.current().content;
            $.scrollElement(pageScroller[0], 0);

        });

        // refresh when application is activated from background
        APP.dom.doc.on("resign", function() {
            lastUpdated = new Date();
        });

        APP.dom.doc.on("active", function() {
            var now = new Date();
            if (now - lastUpdated > APP_FROM_BACKGROUND_REFRESH_TIMEOUT) {

                if (APP.alert.status) APP.alert.hide();
                APP.views.reloadPage();
            }
        });
    }

    /**
     * Checks wether Cordova is available, and then calls initCordova
     * @method init
     */
    function init() {

        // When Cordovia is loaded and talking to the device, initialize it
        navigator.bootstrap.addConstructor(function() {

            attachListeners();
        });
    }

    return {
        "init": init
    };
})();

/**
 * Controls global alerts
 * @author Jeroen Coumans
 * @class alert
 * @namespace APP
 */
APP.alert = (function () {

    var hasAlert;

    /**
     * Show alert
     * @method show
     * @param {String} msg the message of the alert
     */
    function show(msg) {

        if (msg) {

            APP.dom.pageAlert.html(msg);
            APP.dom.pageAlert.show();
            hasAlert = true;

            APP.dom.doc.trigger("APP:alert:show");
        }
    }

    /**
     * Hide alert
     * @method hide
     */
    function hide() {

        APP.dom.pageAlert.hide();
        hasAlert = false;

        APP.dom.doc.trigger("APP:alert:hide");
    }

    /**
     * Status of alert
     * @method status
     * @return {Boolean} true when alert is displayed, false when alert is hidden
     */
    function status() {

        return hasAlert;
    }

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Calls hide() when .action-hide-alert is clicked
        APP.events.attachClickHandler(".action-hide-alert", function () {

            hide();
        });
    }

    /**
     * Initialize variables and attach listeners
     * @method init
     */
    function init() {

        // assign variables
        hasAlert = false;

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();

/**
 * Module that deals with internet connectivity
 * @author Jeroen Coumans
 * @class connection
 * @namespace APP
 */
APP.connection = (function () {

    // variables
    var connection,
        offlineMessage;

    /**
     * Called when the connection goes online, will hide the offline alert
     * @method goOnline
     * @private
     */
    function goOnline() {

        connection = "online";

        if (APP.alert.status()) {
            APP.alert.hide();
        }

        APP.dom.doc.trigger("APP:connection:online");
    }

    /**
     * Called when the connection goes offline, will show an offline alert
     * @method goOffline
     * @private
     */
    function goOffline() {

        connection = "offline";
        APP.alert.show(offlineMessage);

        APP.dom.doc.trigger("APP:connection:offline");
    }

    /**
     * Returns the status of the connection
     * @method status
     * @return {String} the connection, either `offline` or `online`
     *
     **/
    function getStatus() {

        return connection;
    }

    /**
     * Sets the status of the connection
     * @method status
     * @param [msg] {String} accepts `offline` or `online` to set the connection status
     * @return {String} the connection, either `offline` or `online`
     *
     **/
    function setStatus(msg) {

        // useful for testing offline / online
        if (msg === "offline") {
            goOffline();
        } else if (msg === "online") {
            goOnline();
        }

        return connection;
    }

    /**
     * Attach event listeners
     * @method attachListeners
     */
    function attachListeners() {

        APP.dom.doc.on("ajaxSuccess", function() {

            APP.connection.setStatus("online");
        });

        APP.dom.doc.on("ajaxError", function() {

            APP.connection.setStatus("offline");
        });
    }

    /***
     * Sets the default connection to online
     * @method init
     */
    function init(params) {

        offlineMessage = (params && params.offlineMessage) ? params.offlineMessage : '<a href="javascript:void(0)" class="action-refresh">De verbinding is verbroken. Probeer opnieuw.</a>';

        // set default connection to online
        goOnline();
        attachListeners();
    }

    return {
        "init": init,
        "getStatus": getStatus,
        "setStatus": setStatus
    };

})();
/**
 * Controls the global loader
 * @author Jeroen Coumans
 * @class loader
 * @namespace APP
 */
APP.loader = (function () {

    // Variables
    var spinnerType,
        loaderText,
        hasLoader,
        timeoutToken;

    /**
     * Shows the loader on top of the page. When no message is given, it will use the text inside #loader .loader-text
     * @method show
     * @param {String} [msg] the message to show in the spinner
     */
    function show(msg) {

        var message = msg || loaderText.text();

        APP.dom.html.addClass("has-loader");
        hasLoader = true;

        if (navigator.spinner) {

            navigator.spinner.show({"message": message});
        } else {

            if (!APP.dom.pageLoaderImg.attr("src")) {
                APP.dom.pageLoaderImg.attr("src", APP.dom.pageLoaderImg.data("img-src"));
            }

            APP.dom.pageLoader.show();
            loaderText.text(message);
        }

        APP.dom.doc.trigger("APP:loader:show");
    }

    /**
     * Hides the loader
     * @method hide
     */
    function hide() {

        APP.dom.html.removeClass("has-loader");
        hasLoader = false;

        if (navigator.spinner) {
            navigator.spinner.hide();
        }
        else {
            APP.dom.pageLoader.hide();
        }

        APP.dom.doc.trigger("APP:loader:hide");
    }

    /**
     * Returns wether the loader is active or not
     * @method status
     */
    function status() {

        return hasLoader;
    }

    /**
     * Attach event listeners
     * @method attachListeners
     */
    function attachListeners() {

        APP.dom.doc.on("APP:views:loadPage:start", function() {

            // show loader if nothing is shown within 0,250 seconds
            timeoutToken = setTimeout(function() {
                APP.loader.show();

            }, 250);
        });

        APP.dom.doc.on("APP:views:loadPage:finish", function() {

            clearTimeout(timeoutToken);
            APP.loader.hide();
        });
    }

    /**
     * Check wether we use native or HTML spinner based on APP.config.cordova
     * @method init
     */
    function init() {

        hasLoader = APP.dom.html.hasClass("has-loader") ? true : false;
        loaderText = APP.dom.pageLoader.find(".loader-text");

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();

/**
 * Module for page navigation
 * @author Jeroen Coumans
 * @class nav
 * @namespace APP
 */
APP.nav = (function () {

    // Variables
    var navheight,
        bodyheight,
        hasNavigation;

    /**
     * Sets height of content based on height of navigation
     * @method setPageHeight
     * @private
     * @param {Integer} height the height to which the page must be set
     */
    function setPageHeight(height) {

        // if navigation is enabled, set the page height to navigation height
        APP.dom.viewport.height(height);
        APP.dom.pageView.height(height);
    }

    /**
     * Shows the navigation
     * @method show
     */
    function show() {

        APP.dom.html.addClass("has-navigation");

        if (!APP.config.webapp) {
            setPageHeight(navheight);
        }

        hasNavigation = true;

        APP.dom.doc.trigger("APP:nav:show");
    }

    /**
     * Hides the navigation
     * @method hide
     */
    function hide() {

        // never hide on tablet
        if (APP.config.tablet) return;

        APP.dom.html.removeClass("has-navigation");

        if (!APP.config.webapp) {
            setPageHeight("");
        }

        hasNavigation = false;

        APP.dom.doc.trigger("APP:nav:hide");
    }

    /**
     * Returns the status of the navigation
     * @method status
     * @return {Boolean} wether the navigation is shown or hidden
     */
    function status() {

        return hasNavigation;
    }

    /**
     * Returns the active item
     * @method active
     * @param {HTMLElement} [elem] sets the HTMLElement to the active navigation element
     * @return {HTMLElement} the active navigation element
     */
    function setActive(elem) {

        if (elem) {

            APP.dom.pageNavActive.removeClass("active");
            APP.dom.pageNavActive = elem.addClass("active");
        }
    }


    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Menu button
        APP.events.attachClickHandler(".action-show-nav", function () {

            show();
        });

        // Hide menu when it's open
        APP.events.attachClickHandler(".action-hide-nav", function () {

            hide();
        });

        // page navigation
        APP.events.attachClickHandler(".action-nav-item", function (event) {

            APP.dom.doc.trigger("APP:action:nav:item:start");

            var target  = $(event.target).closest(".action-nav-item"),
                url     = APP.util.getUrl(target),
                title   = APP.util.getTitle(target);

            setActive(target);
            hide();

            // If user selects the active element, or no URL is found, just close the menu
            if (target === APP.nav.pageNavActive || ! url) return;

            // set page title
            if (title) APP.dom.parentViewTitle.text(title);
            if (url) APP.views.openParentPage(url);

            APP.dom.doc.trigger("APP:action:nav:item:finish");
        });
    }

    /**
     * Initialize capabilities and attach listeners
     * - Sets the active navigation element
     * - Sets the navigation status based on the `has-navigation` class on the HTML element
     * @method init
     */
    function init() {

        hasNavigation = APP.dom.html.hasClass("has-navigation") ? true : false;

        bodyheight = $(window).height();
        navheight = APP.dom.pageNav.height();

        // make sure the navigation is as high as the page
        if (bodyheight > navheight) {
            navheight = bodyheight;
            APP.dom.pageNav.height(navheight);
        }

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status,
        "setActive": setActive
    };

})();

/**
 * Module for revealing contet
 * @author Jeroen Coumans
 * @class reveal
 * @namespace APP
 */
APP.reveal = (function () {

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-reveal", function (event) {

            APP.dom.doc.trigger("APP:action:reveal:start");

            var activeReveal,
                activeContent,
                targetContent,
                activeClass = 'active',
                activeClassSelector = '.' + activeClass,
                target  = $(event.target).closest(".action-reveal");

            if (!target) {
                return;
            }

            activeReveal = target.siblings(activeClassSelector);

            if (activeReveal) {
                activeReveal.removeClass(activeClass);
            }

            target.addClass(activeClass);

            targetContent = APP.util.getUrl(target);

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

            APP.dom.doc.trigger("APP:action:reveal:finish");
        });
    }

    /***
     * Ataches listeners
     * @method init
     */
    function init() {

        attachListeners();
    }

    return {
        "init": init
    };

})();

/**
 * Module for doing search and autocomplete
 * @author Jeroen Coumans
 * @class search
 * @namespace APP
 */
APP.search = (function () {

    // Variables
    var searchForm,
        searchUrl,
        searchInput,
        searchText,
        searchSubmit,
        searchResult,
        searchDelay;

    /**
     * @method form
     * @return {HTMLElement} the search form
     */
    function form() {
        return searchForm;
    }

    /**
     * Does an AJAX post to a URL and inserts it into searchResult
     * @method loadResults
     * @param {String} URL the URL to post to
     * @private
     */
    function loadResults(request) {

        $.ajax({
            url: request,
            // data: { name: 'Zepto.js' },
            timeout: 5000,
            beforeSend: function() {

                // show loader if nothing is shown within 0,5 seconds
                timeoutToken = setTimeout(function() {
                    APP.loader.show();

                }, 250);

            },
            success: function(response) {
                // if we were offline, reset the connection to online
                APP.connection.setStatus("online");

                searchResult.html(response).show();
            },
            error: function(xhr, errorType, error){

                APP.connection.setStatus("offline");
            },
            complete: function() {

                clearTimeout(timeoutToken);
                APP.loader.hide();
            }
        });
    }

    /**
     * Calls loadResults with the searchText. If no query is given, it will check the value of searchInput and use that
     * @method doSearch
     * @param {String} [query] text that should be searched
     */
    function doSearch(query) {

        var searchText = query || searchInput.attr("value");

        if (searchText) {
            searchUrl = searchForm.attr("action") + "?" + searchInput.attr("name") + "=" + searchText;
            loadResults(searchUrl);
        }
    }

    /**
     * Attach event listeners
     * @method attachListeners
     */
    function attachListeners() {

        // Submit search form
        APP.events.attachClickHandler(".action-search-submit", function (event) {

            doSearch();
        });

        // Listen on keys pressed and every 1s, get the search results
        searchInput.on({
            "keyup": function() {
                APP.delay(function() {
                    doSearch();
                }, 1000);
            }
        });
    }

    /**
     * Initialize variables and attach listeners.
     *
     * Sets searchInput (`.action-search-input`), searchSubmit (`.action-search-submit`) and searchResult (`.js-search-results`) based on the searchForm
     * @method init
     * @param {String} [id="#search-form"] sets searchForm to the ID specified
     */
    function init(id) {

        searchForm = id ? $("#" + id) : $("#search-form");
        searchInput = searchForm.find(".action-search-input");
        searchSubmit = searchForm.find(".action-search-submit");
        searchResult = searchForm.find(".js-search-results");
        searchDelay = null;

        attachListeners();
    }

    return {
        "init": init,
        "form": form
    };

})();
/*jshint latedef:true, undef:true, unused:true boss:true */
/*global APP, $, Swipe, document */

/**
 * Module for setting up swipe.js
 */
APP.slideshow = (function () {

    var slideShow,
        slideShowDotsWrapper,
        slideShowDotsItems;

    function prev() {

        if (slideShow) {
            slideShow.prev();
            APP.dom.doc.trigger("APP:slideshow:prev");
        }
    }

    function next() {

        if (slideShow) {
            slideShow.next();
            APP.dom.doc.trigger("APP:slideshow:next");
        }
    }

    function slide(index) {

        if (slideShow) {
            slideShow.slide(index, 300);
            APP.dom.doc.trigger("APP:slideshow:slide");
        }
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-slideshow-next", function () {
            slideShow.next();
        });

    }

    function init(id) {

        slideShowDotsWrapper = $('<div class="slideshow-dots"></div>');

        slideShow = new Swipe(document.getElementById(id), {
            startSlide: 0,
            speed: 300,
            continuous: true,
            disableScroll: false,
            callback: function (index, item) {
                slideShowDotsWrapper.find(".active").removeClass("active");
                $(slideShowDotsItems[index]).addClass("active");
                var img = $(item).find(".js-slideshow-media");
                if (img) img.attr("src", img.data("src"));
            }
        });

        // generate dots
        for (var i=0;i<slideShow.length;i++) {
            slideShowDotsWrapper.append($('<div class="slideshow-dot"></div>'));
        }

        slideShowDotsItems = slideShowDotsWrapper.find(".slideshow-dot");

        // set first to active
        slideShowDotsItems.first().addClass("active");

        // insert after the swipe container
        slideShowDotsWrapper.insertAfter(slideShow.container);

        attachListeners();
    }

    return {
        "init": init,
        "prev": prev,
        "next": next,
        "slide": slide
    };
})();

/*jshint latedef:true, undef:true, unused:true, boss:true */
/*global APP, lscache */

/**
 * Provides methods for storing HTML documents offline
 * @author Jeroen Coumans
 * @class store
 * @namespace APP
 */
APP.store = (function() {

    /**
     * Wrapper around lscache.set
     * Note that this is fire and forget, there are no checks done to verify it's actually set
     */
    function setCache(key, data, expiration) {

        if (! key || ! data) return;

        var seconds = (typeof expiration === "number") ? expiration : 24 * 60 * 60;

        lscache.set(key, data, seconds);
        APP.dom.doc.trigger("APP:store:setCache");
    }

    /**
     * Wrapper around lscache.get
     */
    function getCache(key) {

        if (! key) return;

        var result = lscache.get(key);
        if (result) {

            APP.dom.doc.trigger("APP:store:getCache");
            return result;
        }
    }

    /**
     * Wrapper around lscache.remove
     */
    function deleteCache(key) {

        if (! key) return;
        lscache.remove(key);
    }

    return {
        "setCache": setCache,
        "getCache": getCache,
        "deleteCache": deleteCache
    };

})();
/**
 * Module for using tabs
 * @author Jeroen Coumans
 * @class tabs
 * @namespace APP
 */
APP.tabs = (function () {

    // Variables
    var hasTabs;

    /**
     * Shows the tabs
     * @method show
     */
    function show() {

        APP.dom.html.addClass("has-tabs");
        APP.dom.pageTabs.show();
        hasTabs = true;

        APP.dom.doc.trigger("APP:tabs:show");
    }

    /**
     * Hides the tabs
     * @method hide
     */
    function hide() {

        APP.dom.html.removeClass("has-tabs");
        APP.dom.pageTabs.hide();
        hasTabs = false;

        APP.dom.doc.trigger("APP:tabs:hide");
    }

    /**
     * Wether the tabs are shown or not
     * @method status
     * @return {Boolean} true when shown, false when hidden
     */
    function status() {

        return hasTabs;
    }

    /**
     * Sets or returns the active tab item. NOTE: this only sets the `active` class on the tab item!
     *
     * @method active
     * @param {HTMLElement} [elem] set the active tab item
     * @return {HTMLElement} the active tab item
     */

    function setActive(elem) {

        if (elem) {

            APP.dom.pageTabActive.removeClass("active");
            APP.dom.pageTabActive = elem.addClass("active");
        }
    }

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-tab-item", function (event) {

            APP.dom.doc.trigger("APP:action:tab:item:start");

            var target = $(event.target).closest(".action-tab-item"),
                url = APP.util.getUrl(target);

            if (target === APP.dom.pageTabActive) {

                return true;
            }

            if (url) {

                setActive(target);
                APP.views.openParentPage(url);
                APP.dom.doc.trigger("APP:action:tab:item:finish");
            }
        });
    }

    /***
     * Initialize variables and attach listeners
     * @method init
     */
    function init() {

        hasTabs = APP.dom.html.hasClass("has-tabs") ? true : false;

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status,
        "setActive": setActive
    };

})();

/*jshint latedef:true, undef:true, unused:true boss:true */
/*global APP, $ */

/**
 * Module for handling views
 * @author Jeroen Coumans
 * @class views
 * @namespace APP
 */
APP.views = (function () {

    var _views;

    function setupViews() {

        // view constructor
        function View(container, content, title, position) {
            this.container = container;
            this.content = content;
            this.title = title;
            if (APP.config.webapp) this.container.addClass(position);
        }

        View.prototype.slideInFromLeft = function(url, title) {
            setCurrentView(this);

            this.container.addClass("slide-in-from-left").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-default").removeClass("slide-left slide-in-from-left");
            });

            if (url) loadPage(url);
            if (title) this.title.html(title);

        };

        View.prototype.slideInFromRight = function(url, title) {
            setCurrentView(this);

            this.container.addClass("slide-in-from-right").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-default").removeClass("slide-right slide-in-from-right");
            });

            if (url) loadPage(url);
            if (title) this.title.html(title);
        };

        View.prototype.slideInFromBottom = function(url, title) {
            setCurrentView(this);

            this.container.addClass("slide-in-from-bottom").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-default").removeClass("slide-bottom slide-in-from-bottom");
            });

            if (url) loadPage(url);
            if (title) this.title.html(title);
        };

        View.prototype.slideOutToLeft = function() {
            this.container.addClass("slide-out-to-left").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-left").removeClass("slide-default slide-out-to-left");
            });
        };

        View.prototype.slideOutToRight = function() {
            this.container.addClass("slide-out-to-right").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-right").removeClass("slide-default slide-out-to-right");
            });
        };

        View.prototype.slideOutToBottom = function() {
            setCurrentView(_views.previous);

            this.container.addClass("slide-out-to-bottom").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-bottom").removeClass("slide-default slide-out-to-bottom");
            });
        };

        View.prototype.show = function(url) {
            setCurrentView(this);

            if (url) loadPage(url);
            this.container.removeClass("view-hidden").addClass("view-active");
        };

        View.prototype.hide = function() {

            this.container.addClass("view-hidden").removeClass("view-active");
        };

        // setup our internal views object
        _views = {
            parentView: new View(APP.dom.parentView, APP.dom.parentViewContent, APP.dom.parentViewTitle, "slide-default"),
            childView: new View(APP.dom.childView, APP.dom.childViewContent, APP.dom.childViewTitle, "slide-right"),
            childViewAlt: new View(APP.dom.childViewAlt, APP.dom.childViewAltContent, APP.dom.childViewAltTitle, "slide-right"),
            modalView: new View(APP.dom.modalView, APP.dom.modalViewContent, APP.dom.modalViewTitle, "slide-bottom"),
            current: null,
            previous: null,
            childCount: 0,
            urlHistory: []
        };

        _views.current = _views.parentView;
    }

    /**
     * Set the current view and store the previous one
     * @private
     */
    function setCurrentView(view) {

        if (view) {
            _views.previous = _views.current;
            _views.current = view;
        }
    }

    function pushHistory(url) {

        _views.urlHistory.push(url);
    }

    function popHistory(url) {

        _views.urlHistory.pop(url);
    }

    function replaceHistory(url) {

        if (_views.urlHistory.length > 0) _views.urlHistory[_views.urlHistory.length -1] = url;
    }


    /**
     * Do an AJAX request and insert it into a view. This method also maintains the URL's for each view
     * @method page
     * @param {String} url the URL to call
     * @param {Object} view what page to insert the content int (child, parent or modal)
     */
    function loadPage(url, view, expiration) {

        if (! url) return;

        APP.dom.doc.trigger("APP:views:loadPage:start", url);

        var target = view || _views.current,
            scrollPosition = target.content.get(0).scrollTop,
            cachedUrl = APP.config.offline ? APP.store.getCache(url) : false;

        target.content.empty();

        function insertIntoView(data) {

            target.content.html(data);
            target.url = url;
            replaceHistory(url);

            if (scrollPosition > 10) {
                $.scrollElement(target.content.get(0), 0);
            }

            APP.dom.doc.trigger("APP:views:loadPage:finish", url);
        }

        if (cachedUrl) {

            insertIntoView(cachedUrl);
        } else {

            $.ajax({
                url: url,
                timeout: 10000,
                headers: { "X-PJAX": true },
                success: function(response) {

                    var minutes = expiration || 24 * 60; // lscache sets expiration in minutes, so this is 24 hours

                    if (APP.config.offline) APP.store.setCache(url, response, minutes);
                    insertIntoView(response);
                }
            });
        }
    }


    /**
     * Reloads the current page
     * @method refresh
     * @param {Object} [view] the view that should be refreshed
     */
    function reloadPage(view) {

        APP.dom.doc.trigger("APP:views:reloadPage:start");

        var targetView = view || _views.current;

        if (APP.config.offline) APP.store.deleteCache(targetView.url); // remove current cache entry

        loadPage(targetView.url, targetView);
        APP.dom.doc.trigger("APP:views:reloadPage:finish");
    }

    function pushChild(url, title) {

        APP.dom.doc.trigger("APP:views:pushChild:start");

        if (url) pushHistory(url);

        if (APP.config.webapp) {

            // disable events while we're transitioning
            APP.events.lock(300);

            switch(_views.current) {
                case _views.parentView:

                    _views.parentView.slideOutToLeft();
                    _views.childView.slideInFromRight(url, title);
                break;

                case _views.childView:

                    // make sure childViewAlt is positioned on the right
                    APP.dom.childViewAlt.removeClass("slide-left").addClass("slide-right");

                    APP.delay(function() {
                        _views.childView.slideOutToLeft();
                        _views.childViewAlt.slideInFromRight(url, title);
                    }, 0);
                break;

                case _views.childViewAlt:

                    // make sure childView is positioned on the right
                    APP.dom.childView.removeClass("slide-left").addClass("slide-right");

                    APP.delay(function() {
                        _views.childView.slideInFromRight(url, title);
                        _views.childViewAlt.slideOutToLeft();
                    }, 0);
                break;

                default:
                break;
            }

            _views.childCount++;

        } else {
            _views.parentView.hide();
            _views.childView.show(url);
        }

        APP.dom.doc.trigger("APP:views:pushChild:finish");
    }

    function popChild(url, title) {

        APP.dom.doc.trigger("APP:views:popChild:start");

        popHistory(_views.urlHistory[_views.urlHistory.length - 1]);
        url = url || _views.urlHistory[_views.urlHistory.length - 1];

        if (APP.config.webapp) {

            // disable events while we're transitioning
            APP.events.lock(300);

            switch(_views.current) {
                case _views.childView:

                    if (_views.childCount === 1) {
                        _views.parentView.slideInFromLeft(url, title);
                        _views.childView.slideOutToRight();
                    } else {

                        // make sure childView is positioned on the right
                        APP.dom.childViewAlt.removeClass("slide-right").addClass("slide-left");

                        APP.delay(function() {
                            _views.childView.slideOutToRight();
                            _views.childViewAlt.slideInFromLeft(url, title);
                        }, 0);
                    }
                break;

                case _views.childViewAlt:

                    // make sure childView is positioned on the right
                    APP.dom.childView.removeClass("slide-right").addClass("slide-left");

                    APP.delay(function() {
                        _views.childView.slideInFromLeft(url, title);
                        _views.childViewAlt.slideOutToRight();
                    }, 0);
                break;

                default:
                break;
            }

            _views.childCount--;

        } else {
            _views.parentView.show(url, title);
            _views.childView.hide();
        }

        APP.dom.doc.trigger("APP:views:popChild:finish");
    }

    function pushModal(url, title) {

        if (_views.current === _views.modalView) return; // modal is already open

        APP.dom.doc.trigger("APP:views:pushModal:start");

        APP.dom.html.addClass("has-modalview");

        if (APP.config.webapp) {

            _views.modalView.slideInFromBottom(url, title);

        } else {

            _views.current.hide();
            _views.modalView.show(url, title);
        }

        APP.dom.doc.trigger("APP:views:pushModal:finish");
    }

    function popModal(url, title) {

        if (_views.current !== _views.modalView) return; // modal is not open

        APP.dom.doc.trigger("APP:views:popModal:start");

        APP.dom.html.removeClass("has-modalview");

        if (APP.config.webapp) {

            _views.modalView.slideOutToBottom();
        } else {

            _views.previous.show(url, title);
            _views.modalView.hide();
        }

        APP.dom.doc.trigger("APP:views:popModal:finish");
    }

    function openParentPage(url) {

        APP.dom.doc.trigger("APP:views:openParentPage:start");

        if (APP.config.webapp) {
            APP.dom.parentView.removeClass("slide-left slide-right").addClass("slide-default");
            APP.dom.childView.removeClass("slide-left slide-default").addClass("slide-right");
            APP.dom.childViewAlt.removeClass("slide-left slide-default").addClass("slide-right");
        }

        _views.urlHistory = [];
        loadPage(url, _views.parentView);

        APP.dom.doc.trigger("APP:views:openParentPage:finish");
    }

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Open child page
        APP.events.attachClickHandler(".action-push", function (event) {

            var target = $(event.target).closest(".action-push"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            pushChild(url, title);
        });

        // Open parent page
        APP.events.attachClickHandler(".action-pop", function () {

            popChild();
        });

        // Open modal
        APP.events.attachClickHandler(".action-show-modal", function (event) {

            var target = $(event.target).closest(".action-show-modal"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            pushModal(url, title);
        });

        // Close modal
        APP.events.attachClickHandler(".action-hide-modal", function () {

            popModal();
        });

        // Refresh
        APP.events.attachClickHandler(".action-refresh", function () {

            if (APP.alert.status) APP.alert.hide();
            reloadPage();
        });
    }

    /***
     * Initialize variables and attach listeners
     * @method init
     */
    function init() {

        setupViews();
        attachListeners();
    }

    return {
        "init": init,
        "pushChild": pushChild,
        "popChild": popChild,
        "pushModal": pushModal,
        "popModal": popModal,
        "openParentPage": openParentPage,
        "loadPage": loadPage,
        "reloadPage": reloadPage,
        "list": function() { return _views; },
        "current": function() { return _views.current; }
    };
})();
/*jshint latedef:true, undef:true, unused:true boss:true */
/*global APP */

/**
 * Core module for initializing capabilities and modules
 * @author Jeroen Coumans
 * @class core
 * @namespace APP
 */
APP.core = (function () {

    /**
     * Initialize variables and attach listeners
     * @method init
     */
    function init(params) {

        // Apply user parameters
        APP.config.init(params);

        // Initialize events
        APP.events.init();
        if (APP.config.cordova) APP.phone.init();

        // Go online
        APP.connection.init();

        // Initialize views
        APP.views.init();

        // Initialize the rest
        APP.alert.init();
        APP.loader.init();
        APP.nav.init();
        APP.reveal.init();
        APP.tabs.init();
    }

    return {
        "init": init
    };

})();
