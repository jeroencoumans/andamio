/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

Andamio.dom.pageLoader = $(".js-page-loader");
Andamio.dom.pageLoaderImg = Andamio.dom.pageLoader.find(".js-page-loader-spinner");

Object.defineProperties(Andamio.dom, {
    pageLoaderText: {

        get: function () {
            return this.pageLoader.find(".js-page-loader-text").text();
        },

        set: function (str) {
            this.pageLoader.find(".js-page-loader-text").html(str);
        }
    }
});

Andamio.loader = (function () {

    var isActive;

    return {
        show: function (msg) {

            isActive = true;

            if (msg) {
                Andamio.dom.pageLoaderText = msg;
            }

            Andamio.dom.html.addClass("has-loader");

            if (Andamio.config.cordova) {
                if (navigator.spinner) {
                    navigator.spinner.show({"message": msg});
                }
            }
            else {
                Andamio.dom.pageLoader.show();
            }
        },

        hide: function () {

            isActive = false;
            Andamio.dom.html.removeClass("has-loader");

            if (Andamio.config.cordova) {
                if (navigator.spinner) {
                    navigator.spinner.hide();
                }
            }
            else {
                Andamio.dom.pageLoader.hide();
            }
        },

        get status() {

            return isActive;
        },

        init: function () {

            isActive = Andamio.dom.html.hasClass("has-loader");

            var self = this,
                timeoutToken;

            Andamio.dom.doc.on("Andamio:views:activateView:start", function () {

                // show loader if nothing is shown within 0,250 seconds
                timeoutToken = setTimeout(function () {
                    self.show();

                }, 250);
            });

            Andamio.dom.doc.on("Andamio:views:activateView:finish", function () {

                clearTimeout(timeoutToken);
                self.hide();
            });

            Andamio.dom.doc.on("ajaxError", function () {

                clearTimeout(timeoutToken);
                self.hide();
            });
        }
    };
})();
