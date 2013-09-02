/*jshint browser: true, browser: true, undef:true, unused:true */
/*global Andamio, FastClick, $ */

Andamio.config = (function () {

    return {

        init: function (options) {

            if ($.os.ios) {
                $.os.ios5 = $.os.version.indexOf("5.") !== -1;
                $.os.ios6 = $.os.version.indexOf("6.") !== -1;
            }

            if ($.os.android) {
                $.os.android2 = $.os.version >= "2" && $.os.version < "4"; // yes we also count android 3 as 2 ;-)
                $.os.android4 = $.os.version >= "4" && $.os.version < "5";
            }

            // Setup defaults that can be overridden
            var win = window;

            this.webapp  = win.location.search.search("webapp") > 0 || win.navigator.standalone || Andamio.dom.html.hasClass("webapp");
            this.tmgcontainer = win.navigator.userAgent.indexOf("TMGContainer") > -1;
            this.server  = win.location.origin + win.location.pathname;
            this.touch   = 'ontouchstart' in win;
            this.cache   = window.lscache ? window.lscache.supported() : false;

            // Default expiration times, configurable per view
            this.expiration = {
                all: 24 * 60,
                parentView: 30
            };

            if (Andamio.dom.doc.width() >= 980) {
                $.os.tablet = true;
            }

            if (this.touch) {
                this.fastclick = new FastClick(win.document.body);
            } else {
                Andamio.dom.html.addClass("no-touch");
            }

            // Setup user-defined options
            if (typeof options === "object") {
                for (var key in options) {

                    switch (key) {
                    case "init":
                        break;
                    case "i18n":
                        for (var string in options.i18n) {
                            Andamio.i18n[string] = options.i18n[string];
                        }
                        break;
                    default:
                        this[key] = options[key];
                        break;
                    }
                }
            }

            if (this.tmgcontainer) {
                this.webapp = true;
            }

            if ($.os.tablet) {
                Andamio.dom.html.addClass("tablet");
                Andamio.nav.show();
                this.webapp = true;
            }

            if ($.os.android) {
                this.webapp = false;
            }

            if (this.webapp) {
                Andamio.dom.html.removeClass("website").addClass("webapp");
            } else {
                Andamio.dom.html.removeClass("webapp").addClass("website");
            }

            this.website = !this.webapp;

            for (var os in $.os) {
                if ($.os[os] && os !== "version") {
                    Andamio.dom.html.addClass(os);
                }
            }
        }
    };
})();
