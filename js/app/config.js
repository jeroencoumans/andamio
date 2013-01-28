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

        detect.call(APP.config, navigator.userAgent);

        // basic ios detection
        APP.config.os.ios5 = APP.config.os.ios && APP.config.os.version.indexOf("5.") !== -1;
        APP.config.os.ios6 = APP.config.os.ios && APP.config.os.version.indexOf("6.") !== -1;

        // basic android detection
        APP.config.os.android2 = APP.config.os.android && APP.config.os.version >= "2" && APP.config.os.version < "4"; // yes we also count android 3 as 2 ;-)
        APP.config.os.android4 = APP.config.os.android && APP.config.os.version >= "4" && APP.config.os.version < "5";

        // basic blackberry detection
        APP.config.os.bb10 = navigator.userAgent.indexOf("BB10") > -1;

        // Only enable for iPhone/iPad for now
        APP.config.ftfastclick = APP.config.os.ios;

        // Configurable settings
        APP.config.cordova  = params.cordova || navigator.userAgent.indexOf("TMGContainer") > -1;
        APP.config.offline  = params.offline || lscache.supported();
        APP.config.server   = params.server || APP.dom.win.location.origin + APP.dom.win.location.pathname,
        APP.config.webapp   = params.webapp || APP.config.cordova || APP.util.getQueryParam("webapp", false) === "1" || navigator.standalone;

        // TODO - Lazy media query
        if (document.width >= 980 || APP.config.desktop || APP.config.tablet) {
            APP.dom.html.removeClass("website").addClass("desktop no-touch has-navigation");
            APP.config.webapp = true;
        }

        // When used as standalone app or springboard app
        if (APP.config.webapp)          APP.dom.html.removeClass("website").addClass("webapp");
        if (APP.config.os.ios)          APP.dom.html.addClass("ios");
        if (APP.config.os.ios5)         APP.dom.html.addClass("ios5");
        if (APP.config.os.ios6)         APP.dom.html.addClass("ios6");
        if (APP.config.os.android)      APP.dom.html.addClass("android");
        if (APP.config.os.android2)     APP.dom.html.addClass("android2");
        if (APP.config.os.android4)     APP.dom.html.addClass("android4");
    }

    return {
        "init": init
    };
})();
