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

    /***
     * Initialize capabilities and attach listeners
     */
    function init() {
        var html = $("html");

        initCapabilities();

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

        // needs to come first so we're "online"
        APP.connection.init();
        APP.loader.init();
        APP.open.init();
        APP.nav.init();
        APP.modal.init();
        APP.reveal.init();
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
