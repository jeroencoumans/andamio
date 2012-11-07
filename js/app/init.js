/**
 * Core module for handling events and initializing capabilities
 */
APP.core = (function () {

    function initCapabilities() {

        $.os = $.os || {};

        // basic ios5 detection
        $.os.ios5 = $.os.ios && $.os.version.indexOf("5.") !== -1;
        $.os.ios6 = $.os.ios && $.os.version.indexOf("6.") !== -1;

        // basic android4 detection
        $.os.android4 = $.os.android && $.os.version.indexOf("4.") !== -1;

        $.supports = $.supports || {};
        $.supports.cordova = navigator.userAgent.indexOf("TMGContainer") > -1;

        $.supports.webapp = false;
        $.supports.webapp =  APP.util.getQueryParam("webapp", false) === "1" || navigator.standalone || $.supports.cordova;

        // Only enable for iPhone/iPad for now
        $.supports.ftfastclick = $.os.ios;
    }

    /**
     * Attach Cordova listeners
     */
    function attachCordovaListeners() {

        // scroll to top on tapbar tap
        document.addEventListener("statusbartap", function() {

            var pageScroller = $(".active-view .overthrow");
            $.scrollElement(pageScroller.get(0), 0);

        });
    }

    /***
     * Initialize capabilities and attach listeners
     */
    function init() {
        var html = $("html");

        initCapabilities();

        if ($.supports.cordova) {
            attachCordovaListeners();
        }

        // When used as standalone app or springboard app
        if ($.supports.webapp) {
            html.removeClass("website");
            html.addClass("webapp");
        }

        if ($.os.ios5) {
            html.addClass("ios5");
        }

        // TODO - Lazy media query
        if (document.width >= 980) {
            html.removeClass("website").addClass("webapp desktop no-touch");
        }

        APP.events.init();
        APP.nav.init();
        APP.modal.init();
        APP.tabs.init();
        APP.views.init();
    }

    return {
        "init": init
    };

})();
