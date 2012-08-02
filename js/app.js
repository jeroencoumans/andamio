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

        // basic ios5 detection
        $.os.ios5 = $.os.ios && $.os.version.indexOf("5.") != -1;

        // Uncomment to test iOS5 mode
        // $.os.ios5 = true;

        // when used as (web) app
        $.webapp = navigator.standalone;

        // Uncomment to test standalone mode
        // $.webapp = true;

        // When used as standalone app or springboard app
        if ($.webapp) {
            html.removeClass("website");
            html.addClass("webapp");
        }

        APP.events.init();

        attachListeners();
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-navigation-toggle", function() {
            toggleSections();
            event.preventDefault();
        });

    }

    /**
     * Shows or hides the sections menu
     */
    function toggleSections() {

        html.toggleClass("has-navigation");
    }

    /**
     * Hides the sections menu
     */
     function hideSections() {

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
        "hideSections": hideSections
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

        if ($.webapp) {
            interceptAnchorClicks();
        }
    }

    function interceptAnchorClicks() {

        body.on("click", "a", function(event) {
            if ($(this).attr("target") !== "_blank") {
                event.preventDefault();
                event.stopImmediatePropagation();
                return false;
            }
        });
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

    function hasTouchSupport() {

        // 'tap' events don't work reliably on Android (4)
        return "ontouchstart" in window && !$.os.android;
    }

    /**
     * Attaches a 'click' handler to elements with the given
     * selector. Will use 'tap' events if supported by the browser.
     *
     * @selector String element selector
     * @fn Function the function to call when clicked
     */
    function attachClickHandler(selector, fn) {

        var eventType = hasTouchSupport() ? "tap" : "click";
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
