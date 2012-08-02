var APP = APP || {};

/**
 * Core module for handling events and initializing capabilities
 */
APP.core = (function() {

    var loader,
        html;

    /***
     * Initialize capabilities and attach listeners
     */
    function init() {

        loader = $("#loader");
        html = $("html");

        initCapabilities();

        // When used as standalone app or springboard app
        if ($.supports.webapp) {
            html.removeClass("website");
            html.addClass("webapp");
        }

        APP.events.init();

        attachListeners();
        attachGlobalListeners();
    }

    function initCapabilities() {

        $.supports = $.supports || {};

        // basic ios5 detection
        $.os.ios5 = $.os.ios && $.os.version.indexOf("5.") != -1;
        $.os.ios6 = $.os.ios && $.os.version.indexOf("6.") != -1;

        // Uncomment to test iOS5 mode
        // $.os.ios5 = true;

        $.supports.cordova = APP.util.getQueryParam("cordova") === "1";
        $.supports.webapp = navigator.standalone || $.supports.cordova;


        // Uncomment to test standalone mode
        // $.supports.webapp = true;

        // 'tap' events don't work reliably on Android (4)
        $.supports.touch = "ontouchstart" in window && !$.os.android;

        // fastclick uses touch events for anchor clicks
        // pjax has its own fastclick implementation
        //
        // Unfortunately we cannot use fastclick on ios5 since it contains
        // a bug in the bfcache: whenever the user navigates back the "scroll"
        // event handler breaks and is never fired. This leads to the annoying
        // behaviour where a touch and a scroll is interpreted as a 'tap'.
        // On ios6 this works fine.
        $.supports.fastclick = $.supports.touch && !$.supports.pjax && (!$.os.ios5 && $.os.ios6);
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-navigation-toggle", function(event) {
            toggleNavigation();
            if (!$.supports.webapp) {
                toggleNavigationHeight();
            }

            event.preventDefault();

            return false;
        });

    }

    /**
     * Attach event listeners for global (application) events
     */
     function attachGlobalListeners() {

     }

    /**
     * Sets height of content based on height of navigation
     */
     function toggleNavigationHeight() {

        navigationHeight = $("#page-navigation").height();
        wrapper = $("#page-wrapper");
        content = $(".page-content");

        if (html.hasClass("has-navigation")) {
            wrapper.css("max-height", navigationHeight);
            content.css("max-height", navigationHeight);
        } else {
            wrapper.css("max-height", "");
            content.css("max-height", "");
        }
     }

    /**
     * Shows or hides the navigation menu
     */
    function toggleNavigation() {

        html.toggleClass("has-navigation");
    }

    /**
     * Hides the navigation menu
     */
     function hideNavigation() {

        html.removeClass("has-navigation");
     }

    /**
     * Shows the loader in an overlay
     */
    function showLoader() {

        loader.show();
    }

    /**
     * Hides the loader
     */
    function hideLoader() {

        loader.hide();
    }

    return {
        "init": init,
        "showLoader": showLoader,
        "hideLoader": hideLoader,
        "hideNavigation": hideNavigation
    };

})();


/**
 * Module for dealing with events, esp. preventing click events to happen
 * multiple times during animation or while content is loading.
 */
APP.events = (function() {

    var EVENT_LOCK_TIMEOUT = 500;
    var EVENT_LOCK_LOCKED = true;
    var EVENT_LOCK_UNLOCKED = false;

    var eventLock = EVENT_LOCK_UNLOCKED;

    var body = $(document.body);

    function init() {

        if ($.supports.fastclick) {
            initFastClicks();
        } else if ($.supports.pjax) {
            interceptAnchorClicks();
        }
    }

    /**
     * Fastclick will put touch event handlers on every anchor element. This
     * prevents the 300ms click delay for regular click events
     */
    function initFastClicks() {

        interceptAnchorClicks();

        body.on("tap", "a", function(event) {
            var href = $(event.target).closest("a").attr("href");
            var prefix = "javascript";
            prefix += ":"; // separated, otherwise jslint fails
            if (href && href.indexOf(prefix) !== 0) {
                // tapped on an anchor with a full url
                if (href.indexOf("http") === 0) {
                    // if target blank is set, let it be handled regularly
                    if (isClickInterceptable(this)) {
                        window.location = href;
                    }
                } else if (href.indexOf("/") === 0) {
                    window.location.pathname = href;
                }
            }
        });
    }

    /**
     * Intercepts all clicks on anchor tags
     */
    function interceptAnchorClicks() {

        body.on("click", "a", function(event) {
            if (isClickInterceptable(this)) {
                event.preventDefault();
                event.stopImmediatePropagation();
                return false;
            }
        });
    }

    /**
     * Whether the click on the given element should be intercepted.
     * Currently only clicks with target "_blank" or "mailto"
     * are NOT intercepted.
     */
    function isClickInterceptable(element) {

        element = $(element);

        return element.attr("target") !== "_blank" &&  element.attr("href").indexOf("mailto") !== 0;
    }

    /**
     * Enable or disables the event lock. The event lock prevents double tapping during animation.
     *
     * @param Boolean lock Whether to lock or unlock events: EVENT_LOCK_LOCKED or EVENT_LOCK_UNLOCKED
     * @param Integer timeout The timeout before the lock will automatically unlock.
     * Set to 0 to disable
     */
    function setEventLock(lock, timeout) {

        eventLock = lock;
        if (eventLock === EVENT_LOCK_LOCKED && timeout !== 0) {
            setTimeout(function() {
                eventLock = EVENT_LOCK_UNLOCKED;
            }, timeout || EVENT_LOCK_TIMEOUT);
        }
    }

    /**
     * Locks all click events
     * @param Integer timeout Optional timeout before lock will automatically unlock.
     * Default is 500ms, set to 0 to disable
     */
    function lock(timeout) {

        setEventLock(EVENT_LOCK_LOCKED, timeout);
    }

    /**
     * Unlocks click events lock
     */
    function unlock() {

        setEventLock(EVENT_LOCK_LOCKED);
    }

    /**
     * @return Bool Whether click events are currently locked
     */
    function isLocked() {

        return  eventLock === EVENT_LOCK_LOCKED;
    }

    /**
     * Attaches a 'click' handler to elements with the given
     * selector. Will use 'tap' events if supported by the browser.
     *
     * @selector String element selector
     * @fn Function the function to call when clicked
     */
    function attachClickHandler(selector, fn) {

        var eventType = $.supports.touch ? "tap" : "click";
        body.on(eventType, selector, function(event) {
            if (!APP.events.isLocked()) {
                fn(event);
                return false;
            }
        });
    }

    return {
        "init": init,
        "lock": lock,
        "unlock": unlock,
        "isLocked": isLocked,
        "attachClickHandler": attachClickHandler
    };
})();


APP.util = (function() {

    /**
     * Returns the value for a given query string key.
     * @todo It would be better to parse the query string once and cache the result.
     *
     * @param name Query string key
     * @param defaultValue If the query string is not found it returns this value.
     * @param queryString Query string to pick the value from, if none is provided
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

    return {
        "getQueryParam": getQueryParam
    };
})();
