var APP = APP || {};

/**
 * Core module for handling events and initializing capabilities
 */
APP.core = (function () {

    // Variables
    var loader,
        html,
        parentView,
        childView;

    function initCapabilities() {

        $.supports = $.supports || {};

        // basic ios5 detection
        $.os.ios5 = $.os.ios && $.os.version.indexOf("5.") !== -1;
        $.os.ios6 = $.os.ios && $.os.version.indexOf("6.") !== -1;

        // basic android4 detection
        $.os.android4 = $.os.android && $.os.version.indexOf("4.") !== -1;

        // Uncomment to test iOS5 mode
        // $.os.ios5 = true;

        // Uncomment to test Android 4 mode
        // $.os.android4 = true;

        $.supports.cordova = navigator.userAgent.indexOf("TMGContainer") > -1;
        $.supports.webapp = false;
        if (!$.os.android) {
            $.supports.webapp = navigator.standalone || $.supports.cordova || APP.util.getQueryParam("webapp", false) === "1";
        }
        try {
            var versionMatches = navigator.userAgent.match(/TMGContainer\/(\d+\.\d+)/);
            $.supports.appVersion = versionMatches.length > 1 ? parseFloat(versionMatches[1]) : 0;
        } catch (e) {
            $.supports.appVersion = 0;
        }

        // Uncomment to test standalone mode
        // $.supports.webapp = true;

        $.supports.pjax = $.supports.webapp;
        $.supports.scrollover = $.supports.webapp;
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-push", function (event) {
            childView.removeClass("hidden");
            parentView.addClass("hidden");
            html.addClass("has-childview");
        });

        APP.events.attachClickHandler(".action-pop", function (event) {
            childView.addClass("hidden");
            parentView.removeClass("hidden");
            html.removeClass("has-childview");
        });

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

    /***
     * Initialize capabilities and attach listeners
     */
    function init() {

        loader = $("#loader");
        html = $("html");
        parentView = $("#parent-view");
        childView = $("#child-view");

        initCapabilities();

        // When used as standalone app or springboard app
        if ($.supports.webapp) {
            html.removeClass("website");
            html.addClass("webapp");
        }

        if ($.os.ios) {
            html.addClass("iphone");
        }

        if ($.os.android) {
            html.addClass("android");
        }

        attachListeners();
        APP.events.init();
    }

    return {
        "init": init,
        "showLoader": showLoader,
        "hideLoader": hideLoader
    };

})();

/**
 * Module for dealing with events, esp. preventing click events to happen
 * multiple times during animation or while content is loading.
 */
APP.events = (function () {

    var EVENT_LOCK_TIMEOUT = 500,
        EVENT_LOCK_LOCKED = true,
        EVENT_LOCK_UNLOCKED = false,

        eventLock = EVENT_LOCK_UNLOCKED,

        body = $(document.body);

    function init() {

        var fastclick = new FastClick(document.body);

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
            setTimeout(function () {
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

        body.on("click", selector, function(event) {
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


APP.util = (function () {

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

    /**
     * Returns whether the given (anchor) element contains an external link
     */
    function isExternalLink(element) {

        element = $(element);

        return element.attr("target") === "_blank";
    }

    return {
        "getQueryParam": getQueryParam,
        "isExternalLink": isExternalLink
    };
})();