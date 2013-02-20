/*jshint es5: true, browser: true, boss:true */
/*global Andamio, FastClick */

Andamio.config = (function () {

    "use strict";

    /*** Zepto detect.js ***/
    var detect = function(ua) {
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
        os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
            (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))));
    };

    return {

        get webapp() {
            return Andamio.dom.html.hasClass("webapp");
        },

        set webapp(value) {

            if (value) {
                Andamio.dom.html.removeClass("website").addClass("webapp");
            } else {
                Andamio.dom.html.removeClass("webapp").addClass("website");
            }
        },

        init: function(options) {

            detect.call(this, navigator.userAgent);

            if (this.os.ios) {
                this.os.ios5 = this.os.version.indexOf("5.") !== -1;
                this.os.ios6 = this.os.version.indexOf("6.") !== -1;
            }

            if (this.os.android) {
                this.os.android2 = this.os.version >= "2" && this.os.version < "4"; // yes we also count android 3 as 2 ;-)
                this.os.android4 = this.os.version >= "4" && this.os.version < "5";
            }

            // Setup defaults that can be overridden
            this.webapp  = Andamio.dom.win.location.search.search("webapp") > 0 || Andamio.dom.win.navigator.standalone;
            this.cordova = Andamio.dom.win.navigator.userAgent.indexOf("TMGContainer") > -1;
            this.server  = Andamio.dom.win.location.origin + Andamio.dom.win.location.pathname;
            this.touch   = 'ontouchstart' in Andamio.dom.win;

            // Setup user-defined options
            if (typeof options === "object") {

                for (var key in options) {
                    if (key === "init") return;
                    this[key] = options[key];
                }
            }

            if (this.touch) {
                this.fastclick = new FastClick(window.document.body);
            } else {
                Andamio.dom.html.addClass("no-touch");
            }

            if (this.cordova) {
                this.webapp = true;
            }

            if (this.os.tablet || Andamio.dom.doc.width() >= 980) {
                Andamio.dom.html.addClass("desktop has-navigation");
            }

            if (this.os.ios)        { Andamio.dom.html.addClass("ios"); }
            if (this.os.ios5)       { Andamio.dom.html.addClass("ios5"); }
            if (this.os.ios6)       { Andamio.dom.html.addClass("ios6"); }
            if (this.os.android)    { Andamio.dom.html.addClass("android"); }
            if (this.os.android2)   { Andamio.dom.html.addClass("android2"); }
            if (this.os.android4)   { Andamio.dom.html.addClass("android"); }
        }
    };
})();
