/*jshint latedef:true, undef:true, unused:true boss:true */
/*global APP:false, navigator, document, lscache */

/**
 * Core module for initializing capabilities and modules
 * @author Jeroen Coumans
 * @class core
 * @namespace APP
 */
APP.config = (function () {

    /*** Zepto detect.js ***/
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

        // Only enable for iPhone/iPad for now
        APP.config.ftfastclick = $.os.ios;

        // Configurable settings
        APP.config.cordova  = (typeof params.cordova !== "undefined") ? params.cordova : navigator.userAgent.indexOf("TMGContainer") > -1;
        APP.config.offline  = (typeof params.offline !== "undefined") ? params.offline : lscache.supported();
        APP.config.server   = (typeof params.server !== "undefined") ? params.server : APP.dom.win.location.origin + APP.dom.win.location.pathname;

        if (typeof params.webapp !== "undefined") {
            APP.config.webapp   = params.webapp;
        } else {
            APP.config.webapp = APP.config.cordova || APP.util.getQueryParam("webapp", false) === "1" || navigator.standalone;
        }

        // TODO - Lazy media query
        if (document.width >= 980 || APP.config.desktop || APP.config.tablet) {
            APP.dom.html.removeClass("website").addClass("desktop no-touch has-navigation");
            APP.config.webapp = true;
        }

        // When used as standalone app or springboard app
        if (APP.config.webapp)          APP.dom.html.removeClass("website").addClass("webapp");
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
