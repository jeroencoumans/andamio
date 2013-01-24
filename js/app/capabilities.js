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

        $.supports.webapp =  APP.util.getQueryParam("webapp", false) === "1" || navigator.standalone || $.supports.cordova;

        // Only enable for iPhone/iPad for now
        $.supports.ftfastclick = $.os.ios;

        // When used as standalone app or springboard app
        if ($.supports.webapp)  APP.dom.html.removeClass("website").addClass("webapp");
        if ($.os.ios)           APP.dom.html.addClass("ios");
        if ($.os.ios5)          APP.dom.html.addClass("ios5");
        if ($.os.ios6)          APP.dom.html.addClass("ios6");
        if ($.os.android)       APP.dom.html.addClass("android");
        if ($.os.android2)      APP.dom.html.addClass("android2");
        if ($.os.android4)      APP.dom.html.addClass("android4");

        // TODO - Lazy media query
        if (document.width >= 980) {
            APP.dom.html.removeClass("website").addClass("webapp desktop no-touch");
        }
    }

    init();

})();
