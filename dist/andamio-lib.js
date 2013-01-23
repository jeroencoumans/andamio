var APP = APP || {};

APP.globals = {};

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
/**
 * Core module for initializing capabilities and modules
 * @author Jeroen Coumans
 * @class core
 * @namespace APP
 */
APP.capabilities = (function () {

    /**
     * Initialize capabilities based on UA detection
     * @method initCapabilities
     */
    function init() {

        $.os = $.os || {};

        // basic ios5 detection
        $.os.ios5 = $.os.ios && $.os.version.indexOf("5.") !== -1;
        $.os.ios6 = $.os.ios && $.os.version.indexOf("6.") !== -1;

        // basic android detection
        $.os.android2 = $.os.android && $.os.version >= "2" && $.os.version < "4"; // yes we also count android 3 as 2 ;-)
        $.os.android4 = $.os.android && $.os.version >= "4" && $.os.version < "5";

        // basic blackberry detection
        $.os.bb10 = navigator.userAgent.indexOf("BB10") > -1;

        $.supports = $.supports || {};
        $.supports.cordova = navigator.userAgent.indexOf("TMGContainer") > -1;

        $.supports.webapp = false;
        $.supports.webapp =  APP.util.getQueryParam("webapp", false) === "1" || navigator.standalone || $.supports.cordova;

        // Only enable for iPhone/iPad for now
        $.supports.ftfastclick = $.os.ios;

        // Setup HTML classes
        var html = $("html");

        // When used as standalone app or springboard app
        if ($.supports.webapp) html.removeClass("website").addClass("webapp");
        if ($.os.ios) html.addClass("ios");
        if ($.os.ios5) html.addClass("ios5");
        if ($.os.ios6) html.addClass("ios6");
        if ($.os.android) html.addClass("android");
        if ($.os.android2) html.addClass("android2");
        if ($.os.android4) html.addClass("android4");

        // TODO - Lazy media query
        if (document.width >= 980) {
            html.removeClass("website").addClass("webapp desktop no-touch");
        }
    }

    init();

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

        if ($.supports.ftfastclick) {
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
 * Module that enhances the webapp with Cordova functionality
 * @author Jeroen Coumans
 * @class phone
 * @namespace APP
 */
APP.phone = (function () {

    var APP_FROM_BACKGROUND_REFRESH_TIMEOUT = 30 * 60 * 1000,
        lastUpdated = new Date();

    /**
     * Listens to all clicks on anchor tags and opens them in Cordova popover if it's an external URL
     * @method interceptAnchorClicks
     * @private
     */
    function interceptAnchorClicks() {

        $(document.body).on("click", "a", function() {
            if (APP.util.isExternalLink(this)) {

                // open external URL's in in-app Cordova browser
                var href = $(this).attr("href");
                navigator.utility.openUrl(href, "popover");
                return false;
            } else {
                return true;
            }
        });
    }

    /**
     * Attach Cordova listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // hide splashscreen
        navigator.bootstrap.addConstructor(function() {
            cordova.exec(null, null, "SplashScreen", "hide", []);
        });

        // scroll to top on tapbar tap
        document.addEventListener("statusbartap", function() {

            var pageScroller;

            if (APP.nav.status()) {

                pageScroller = $("#page-navigation.overthrow");
            } else {

                pageScroller = $(".active-view").find(".overthrow");
            }

            pageScroller.each(function() {

                var that = $(this),
                    hasOverflow = that.css("overflow");

                if (hasOverflow === "auto") {
                    $.scrollElement(that.get(0), 0);
                }
            });
        }, false);

        // refresh when application is activated from background
        document.addEventListener("resign", function() {
            lastUpdated = new Date();
        });

        document.addEventListener("active", function() {
            var now = new Date();
            if (now - lastUpdated > APP_FROM_BACKGROUND_REFRESH_TIMEOUT) {

                if (APP.alert.status) APP.alert.hide();
                APP.open.refresh();
            }
        }, false);
    }

    /**
     * Init Cordova stuff. Only called when Cordova is actually loaded
     * @method initCordova
     * @private
     */
    function initCordova() {

        interceptAnchorClicks();
        attachListeners();
    }

    /**
     * Checks wether Cordova is available, and then calls initCordova
     * @method init
     */
    function init() {

        // When Cordovia is loaded and talking to the device, initialize it
        navigator.bootstrap.addConstructor(function() {
            initCordova();
        });
    }

    return {
        "init": init
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
    var connection;

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
    }

    /**
     * Called when the connection goes offline, will show an offline alert
     * @method goOffline
     * @private
     */
    function goOffline() {

        connection = "offline";

        var offlineText = $('<a href="javascript:void(0)" class="action-refresh">Pagina kon niet geladen worden. Opnieuw laden</a>');
        APP.alert.show(offlineText);
    }

    /**
     * Returns the status of the connection, typically called from APP.open.page() when a timeout occurs
     * @method status
     * @param [msg] {String} accepts `offline` or `online` to set the connection status
     * @return {String} the connection, either `offline` or `online`
     *
     **/
    function status(msg) {

        // useful for testing offline / online
        if (msg === "offline") {
            goOffline();
        } else if (msg === "online") {
            goOnline();
        }

        return connection;
    }

    /***
     * Sets the default connection to online
     * @method init
     */
    function init() {

        // set default connection to online
        goOnline();
    }

    return {
        "init": init,
        "status": status
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
    var pageLoader,
        spinnerType,
        loaderText,
        hasLoader,
        html;

    /**
     * Shows the loader on top of the page. When no message is given, it will use the text inside #loader .loader-text
     * @method show
     * @param {String} [msg] the message to show in the spinner
     */
    function show(msg) {

        var message = msg || loaderText.text();

        html.addClass("has-loader");
        hasLoader = true;

        if (spinnerType === "native") {

            navigator.spinner.show({"message": message});
        } else {

            var img = $("#loader").find("img");

            if (!img.attr("src")) {
                img.attr("src", img.data("img-src"));
            }

            pageLoader.show();
            loaderText.text(message);
        }

    }

    /**
     * Hides the loader
     * @method hide
     */
    function hide() {

        html.removeClass("has-loader");
        hasLoader = false;

        if (spinnerType === "native") {

            navigator.spinner.hide();
        } else {

            pageLoader.hide();
        }
    }

    /**
     * Returns wether the loader is active or not
     * @method status
     */
    function status() {

        return hasLoader;
    }

    /**
     * Check wether we use native or HTML spinner based on $.supports.cordova
     * @method init
     */
    function init() {

        html = $("html");
        hasLoader = html.hasClass("has-loader") ? true : false;
        loaderText = $("#loader .loader-text");

        if ($.supports.cordova) {

            // only set the spinner to native when Cordova is injected
            navigator.bootstrap.addConstructor(function() {
                spinnerType = "native";
            });
        } else {

            spinnerType = "html",
            pageLoader = $("#loader"),
            html = $("html");
        }

    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
/**
 * Wrapper for doing an AJAX request
 * @author Jeroen Coumans
 * @class open
 * @namespace APP
 */
APP.open = (function () {

    // function variables
    var active,
        parent,
        child,
        modal;

    /**
     * This method is used to set or return the active URL. It's used for e.g. refreshing the current page
     * @method activeUrl
     * @param {String} [href] the URL that should be set to active
     * @return {String} the URL that is currently set to active
     **/
    function activeUrl(href) {
        if (href) {
            active = href;
        } else {
            return active;
        }
    }

    /**
     * @method parentUrl
     * @return {String} the URL that is loaded in the parent element
    */
    function parentUrl() { return parent; }

    /**
     * @method childUrl
     * @return {String} the URL that is loaded in the child element
    */
    function childUrl()  { return child;  }

    /**
     * @method modalUrl
     * @return {String} the URL that is loaded in the modal element
    */
    function modalUrl()  { return modal;  }

    /**
     * Do an AJAX request and insert it into a view. This method also maintains the URL's for each view, and sets the activeUrl to the called URL.
     * @method page
     * @param {String} url the URL to call
     * @param {HTMLElement} view what page to insert the content int (child, parent or modal)
     * @param {Boolean} [refresh] when set, the activeUrl will be downloaded again. You need to set this parameter if you want to explicitly refresh a page.
     * @param {Function} [callback] optional callback function that will be called when the AJAX call completes
     */
    function page(url, view, refresh, callback) {

        if (! url || ! view) return;

        // make sure to open the parent
        if (APP.views.hasChildPage() && view === APP.views.parentView()) {

            APP.views.openParentPage();
        }

        // variables
        var content = $(view).find(".js-content"),
            scrollPosition = content.get(0).scrollTop,
            timeoutToken = null,
            loaderText;

        // Set the URL of the view
        switch (view) {
            case APP.views.parentView():
                parent = url;
                break;

            case APP.views.childView():
                child = url;
                break;

            case APP.modal.modalView():
                modal = url;
                break;
        }

        // Prevent page load when opening the same URL
        if (active === url && ! refresh) {

            return false;
        } else {

            // Set the active url to the passed url
            active = url;
            content.empty();
        }

        if (refresh) {
            loaderText = "Refreshing...";
        } else {
            loaderText = "Loading...";
        }

        $.ajax({
            url: url,
            timeout: 7500,
            headers: { "X-PJAX": true },
            beforeSend: function() {

                // show loader if nothing is shown within 0,5 seconds
                timeoutToken = setTimeout(function() {
                    APP.loader.show();

                }, 250);

            },
            success: function(response) {

                // if we were offline, reset the connection to online
                APP.connection.status("online");

                $(content).html(response);

                if (scrollPosition > 10) {
                    $.scrollElement($(content).get(0), 0);
                }
            },
            error: function(xhr, errorType, error) {

                APP.connection.status("offline");
                $(document.body).trigger("APP:open:page:error");
            },
            complete: function() {

                clearTimeout(timeoutToken);
                APP.loader.hide();
                if ($.isFunction(callback)) callback();
            }
        });
    }

    /**
     * Checks what the active view is and then calls APP.open.page with its respective URL, view and refresh
     * @method refresh
     */
    function refresh() {

        // check wether to refresh child or parent page
        if (APP.views.hasChildPage()) {

            page(child, APP.views.childView(), true);

        } else if (APP.modal.status()) {

            page(modal, APP.modal.modalView(), true);

        } else {

            page(parent, APP.views.parentView(), true);
        }
    }

    /**
     * Attach event listeners
     * @method attachListeners
     */
    function attachListeners() {

        // Open parent page
        APP.events.attachClickHandler(".action-refresh", function (event) {

            if (APP.alert.status) APP.alert.hide();
            refresh();
        });
    }

    /***
     * Attach listeners
     * @method init
     */
    function init() {

        attachListeners();
    }

    return {
        "init": init,
        "page": page,
        "refresh": refresh,
        "activeUrl": activeUrl,
        "parentUrl": parentUrl,
        "childUrl": childUrl,
        "modalUrl": modalUrl
    };

})();

/**
 * Module for dealing with modals
 * @author Jeroen Coumans
 * @class modal
 * @namespace APP
 */
APP.modal = (function () {

    // Variables
    var html,
        modal,
        toggle,
        hasModalview;

    /**
     * @method modalView
     * @static
     * @return {HTMLElement} the modal element
     */
    function modalView() { return modal; }

    /**
     * Opens the modal view
     * @method show
     */
    function show() {

        if (APP.alert.status) APP.alert.hide();

        html.addClass("has-modalview");
        toggle.addClass("active");
        APP.views.pageView().addClass("view-hidden");
        modal.removeClass("view-hidden").addClass("active-view");
        hasModalview = true;
    }

    /**
     * Hides the modal view
     * @method hide
     */
    function hide() {

        html.removeClass("has-modalview");
        toggle.removeClass("active");
        APP.views.pageView().removeClass("view-hidden");
        modal.addClass("view-hidden").removeClass("active-view");
        hasModalview = false;
    }

    /**
     * Returns the status of the modal view
     * @method status
     * @return {Boolean} wether modal view is shown or not
     */
    function status() {

        return hasModalview;
    }

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        /*
         * Open modal
         * - if data-url is specified, it will be loaded into the modal content
         * - otherwise, if href has a URL, it will be loaded into the modal content
         * - if the action has text, it will be used as the title
         */
        APP.events.attachClickHandler(".action-show-modal", function (event) {

            var target = $(event.target).closest(".action-show-modal"),
                url = APP.util.getUrl(target),
                title = APP.util.getTitle(target);

            show();

            if (url) {
                APP.open.page(url, modal);
            }

            if (title) {
                modal.find(".js-title").text(title);
            }
        });

        /*
         * Close modal
         */
        APP.events.attachClickHandler(".action-hide-modal", function () {

            hide();
        });
    }

    /**
     * Initialize variables and attach listeners
     * @method init
     */
    function init() {

        html = $("html");
        modal = $("#modal-view");
        toggle = $(".action-show-modal");
        hasModalview = html.hasClass("has-modalview") ? true : false;

        attachListeners();
    }

    return {
        "init": init,
        "modalView": modalView,
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
    var html,
        viewport,
        nav,
        toggle,
        navItems,
        activeItem,
        navheight,
        bodyheight,
        pageView,
        hasNavigation;


    /**
     * Sets height of content based on height of navigation
     * @method setPageHeight
     * @private
     * @param {Integer} height the height to which the page must be set
     */
    function setPageHeight(height) {

        // if navigation is enabled, set the page height to navigation height
        viewport.height(height);
        pageView.height(height);
    }

    /**
     * Shows the navigation
     * @method show
     */
    function show() {

        html.addClass("has-navigation");
        toggle.addClass("active");

        if (!$.supports.webapp) {
            setPageHeight(navheight);
        }

        hasNavigation = true;
    }

    /**
     * Hides the navigation
     * @method hide
     */
    function hide() {

        html.removeClass("has-navigation");
        toggle.removeClass("active");

        if (!$.supports.webapp) {
            setPageHeight("");
        }

        hasNavigation = false;
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
     * Returns the nav items, useful for activating a new tab
     * @method items
     * @static
     * @return {HTMLElement} the navigation items
     */
    function items() {

        return navItems;
    }

    /**
     * Returns the active item
     * @method active
     * @param {HTMLElement} [elem] sets the HTMLElement to the active navigation element
     * @return {HTMLElement} the active navigation element
     */
    function active(elem) {

        if (elem) {

            activeItem.removeClass("active");
            activeItem = elem.addClass("active");
        } else {

            return activeItem;
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

            var target  = $(event.target).closest(".action-nav-item"),
                url     = APP.util.getUrl(target),
                title   = APP.util.getTitle(target);

            // If user selects the active element, or no URL is found, just close the menu
            if (target === active() || ! url) {

                hide();
                return;
            }

            active(target);
            hide();

            // set page title
            if (title) {

                APP.views.parentView().find(".js-title").text(title);
            }

            APP.open.page(url, APP.views.parentView());

        });
    }

    /**
     * Initialize capabilities and attach listeners
     * - Sets the active navigation element
     * - Sets the navigation status based on the `has-navigation` class on the HTML element
     * @method init
     */
    function init() {

        viewport = $(".viewport");
        pageView = $("#page-view");
        html = $("html");

        nav = $("#page-navigation");
        toggle = $(".action-show-nav");
        navItems = nav.find(".action-nav-item");
        activeItem = navItems.filter(".active");

        hasNavigation = html.hasClass("has-navigation") ? true : false;

        bodyheight = $(window).height();
        navheight = nav.height();

        // make sure the navigation is as high as the page
        if (bodyheight > navheight) {
            navheight = bodyheight;
            nav.height(navheight);
        }

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status,
        "items": items,
        "active": active
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
                APP.connection.status("online");

                searchResult.html(response).show();
            },
            error: function(xhr, errorType, error){

                APP.connection.status("offline");
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
/**
 * Provides methods for storing HTML documents offline
 * @author Jeroen Coumans
 * @class store
 * @namespace APP
 */
APP.store = (function() {

    var server,
        isLoading;

    /**
     * @method loading
     * @return {Boolean} wether we're currently loading
     */
    function loading() {

        return isLoading;
    }

    /**
     * Loads an URL from localStorage.
     * @method showUrl
     * @param {String} url the URL that will be loaded. The URL is used as the key. The value will be parsed as JSON.
     * @param {Boolean} loaded wether or not to load silently (default) or show a loader when fetching the URL
     * @return {String} the value that was stored. Usually, this is raw HTML.
     */
    function showUrl(url, loader, callback) {

        if (! url) return;

        // set result
        var result = lscache.get(url);

        if (result) {

            callback(result);
        } else {

            if (loader) APP.loader.show();
            // console.log("Article wasn't stored, storing it now...");

            storeUrl(url, false, false, function(status) {

                // console.log("Article stored, calling showUrl again...");

                if (status === "success") {

                    if (loader) APP.loader.hide();
                    var result = lscache.get(url);

                    callback(result);
                } else {

                    APP.alert.show("Couldn't load article");
                }
            });
        }
    }

    /**
     * Does an AJAX call to URL and stores it with the URL as the key
     * @method storeUrl
     * @param {String} url the URL to be stored
     * @param {Boolean} [absolute] if false, the server will be prefixed to URL's
     * @param {Integer} [expiration=365*24*60] after how long should the stored URL expire. Set in minutes, defaults to 1 year.
     * @param {Function} [callback] callback function when the AJAX call is complete
    */
    function storeUrl(url, absolute, expiration, callback) {

        if (! url || lscache.get(url)) return;

        var expire = expiration ? expiration : 365*24*60,
            request = absolute ? url : server + url;

        $.ajax({
            url: request,
            timeout: 20000,
            global: false, // don't fire off global AJAX events, we want to load in the background
            headers: { "X-PJAX": true },
            beforeSend: function() {

                isLoading = true;
            },
            success: function(response) {

                lscache.set(url, response, expire);
            },
            complete: function(xhr,status) {

                isLoading = false;

                if ($.isFunction(callback)) callback(status);
            }
        });
    }

    /**
     * Wrapper around storeUrl to store an array of URLs
     * @method storeUrlList
     * @param {Array} list an array of URL's
     * @param {Boolean} [absolute] if false, the server will be prefixed to URL's
     * @param {Integer} [expiration=365*24*60] after how long should the stored URL expire. Set in minutes, defaults to 1 year.
     * @param {Function} [callback] callback function when the AJAX call is complete
     */
    function storeUrlList(list, absolute, expiration, callback) {

        if (! list) return;

        // TODO: show progress meter
        // var loaded = 0;

        $(list).each(function(index, item) {

            storeUrl(item, absolute, expiration, function(status) {
                if (status === "success") {
                    // loaded++;
                    // var loadedPercentage = Math.round(loaded / list.length * 100) + "%";
                    // console.log(loadedPercentage);
                } else {
                    // console.log(status);
                }
            });
        });

        if ($.isFunction(callback)) callback();
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
     * Initialize variables and settings
     * @method init
     * @param {Object} [params.server] optional server that will be used as the default host
     */
    function init(params) {

        isLoading = false;
        server = (params && params.server) ? params.server : "http://localhost";
    }

    return {
        "init": init,
        "loading": loading,
        "storeUrl": storeUrl,
        "storeUrlList": storeUrlList,
        "getUrlList": getUrlList,
        "showUrl": showUrl
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
    var html,
        tabs,
        tabItems,
        activeItem,
        hasTabs;

    /**
     * Shows the tabs
     * @method show
     */
    function show() {

        html.addClass("has-tabs");
        tabs.show();
        hasTabs = true;
    }

    /**
     * Hides the tabs
     * @method hide
     */
    function hide() {

        html.removeClass("has-tabs");
        tabs.hide();
        hasTabs = false;
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
     * Returns the tab items, useful for activating a new tab
     * @method items
     * @return {Object} returns an object that contains all .action-tab-item elements
     */
    function items() {

        return tabItems;
    }

    /**
     * Sets or returns the active tab item. NOTE: this only sets the `active` class on the tab item!
     *
     * @method active
     * @param {HTMLElement} [elem] set the active tab item
     * @return {HTMLElement} the active tab item
     */

    function active(elem) {

        if (elem) {

            activeItem.removeClass("active");
            activeItem = elem.addClass("active");
        } else {

            return activeItem;
        }
    }

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-tab-item", function (event) {

            var target = $(event.target).closest(".action-tab-item"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            if (target === active()) {

                return true;
            }

            if (url) {

                active(target);
                APP.open.page(url, APP.views.parentView());
            }
        });
    }

    /***
     * Initialize variables and attach listeners
     * @method init
     */
    function init() {

        html = $("html");
        tabs = $("#page-tabs");
        tabItems = tabs.find(".action-tab-item");
        activeItem = tabs.find(".active");
        hasTabs = html.hasClass("has-tabs") ? true : false;

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status,
        "items": items,
        "active": active
    };

})();

/**
 * Module for handling views
 * @author Jeroen Coumans
 * @class views
 * @namespace APP
 */
APP.views = (function () {

    // Variables
    var html,
        page,
        parent,
        child,
        hasChild;

    /**
     * @method parentView
     * @return {HTMLElement} returns the parent element
     */
    function parentView() { return parent; }

    /**
     * @method childView
     * @return {HTMLElement} returns the child element
     */
    function childView() { return child; }

    /**
     * @method pageView
     * @return {HTMLElement} returns the page element
     */
    function pageView() { return page; }

    /**
     * Returns wether the childview is active or not
     * @method hasChildPage
     * @return {Boolean} true if childPage is active, false if parentView is active
     */
    function hasChildPage() {

        return hasChild;
    }

    /**
     * Opens child page
     * @method openChildPage
     * @param {String} [url] will call APP.open.page to do an AJAX request to URL and open it in the `.js-content` of childView
     * @param {String} [title] will set the title of the childView in the `.js-title` element
     */
    function openChildPage(url, title) {

        if (APP.alert.status) APP.alert.hide();

        // go forward when called from parent page
        if (! hasChild) {
            html.addClass("childview-in");
            child.removeClass("view-hidden").addClass("active-view");
            parent.addClass("view-hidden").removeClass("active-view");

            // execute after animation timeout
            APP.delay(function() {
                html.addClass("has-childview");
                html.removeClass("childview-in");
            }, 300);
        }

        // load URL
        if (url) {

            child.find(".js-content").html("");
            APP.open.page(url, child);
        }

        // set title
        if (title) {
            child.find(".js-title").text(title);
        }

        hasChild = true;
    }

    /**
     * Opens parent page. If a childView is active, first go back to the parentView.
     * @method openParentPage
     * @param {String} [url] will call APP.open.page to do an AJAX request to URL and open it in the `.js-content` of parentView
     * @param {String} [title] will set the title of the parentView in the `.js-title` element
     */
    function openParentPage(url, title) {

        if (APP.alert.status) APP.alert.hide();

        // go back when called from child page
        if (hasChild) {
            html.addClass("childview-out");
            child.addClass("view-hidden").removeClass("active-view");
            parent.removeClass("view-hidden").addClass("active-view");

            // execute after animation timeout
            APP.delay(function() {
                html.removeClass("has-childview childview-out");
            }, 300);
        }

        // load URL
        if (url) {
            APP.open.page(url, parent);
        }

        // set title
        if (title) {
            parent.find(".js-title").text(title);
        }

        hasChild = false;
    }

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Open parent page
        APP.events.attachClickHandler(".action-pop", function (event) {

            /*
             *  Stop loader if one was already being displayed,
             *  e.g. by going navigating while the previous AJAX call wass not finished
            */
            if (APP.loader.status()) {
                APP.loader.hide();
            }

            var target = $(event.target).closest(".action-pop"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            if (url) {

                openParentPage(url, title);
            } else {

                // update the active url manually since this action often doesn't use a URL
                APP.open.activeUrl(APP.open.parentUrl());

                openParentPage();
            }
        });

        // Open child page
        APP.events.attachClickHandler(".action-push", function (event) {

            var target = $(event.target).closest(".action-push"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            if (url) {

                openChildPage(url, title);
            } else {

                openChildPage();
            }
        });
    }

    /***
     * Initialize variables and attach listeners. Sets the status of hasChildPage to true if the `html` element has the `.has-childview` class
     * @method init
     */
    function init() {

        html = $("html");
        page = $("#page-view");
        parent = $("#parent-view");
        child = $("#child-view");
        hasChild = html.hasClass("has-childview") ? true : false;

        attachListeners();
    }

    return {
        "init": init,
        "pageView": pageView,
        "parentView": parentView,
        "childView": childView,
        "openChildPage": openChildPage,
        "openParentPage": openParentPage,
        "hasChildPage": hasChildPage
    };

})();
/**
 * Controls global alerts
 * @author Jeroen Coumans
 * @class alert
 * @namespace APP
 */
APP.alert = (function () {

    var pageAlert,
        hasAlert;

    /**
     * Show alert
     * @method show
     * @param {String} msg the message of the alert
     */
    function show(msg) {

        if (msg) {
            pageAlert.html(msg);
            pageAlert.show();
            hasAlert = true;
        }
    }

    /**
     * Hide alert
     * @method hide
     */
    function hide() {

        pageAlert.hide();
        hasAlert = false;
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
        pageAlert = $("#page-alert");
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

        APP.events.init();

        // needs to come first so we're "online"
        APP.connection.init();
        APP.loader.init();
        APP.open.init();
        APP.nav.init();
        APP.modal.init();
        APP.reveal.init();
        APP.store.init(params);
        APP.tabs.init();
        APP.views.init();
        APP.alert.init();

        if ($.supports.cordova) {
            APP.phone.init();
        }
    }

    return {
        "init": init
    };

})();
