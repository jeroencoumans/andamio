/*jshint es5: true, browser: true */
/*global $, Andamio */

Andamio.dom.pageLoader = $(".js-page-loader");
Andamio.dom.pageLoaderImg = Andamio.dom.pageLoader.find(".js-page-loader-spinner");

Object.defineProperties(Andamio.dom, {
    pageLoaderText: {

        get: function() {
            return this.pageLoader.find(".js-page-loader-text").text();
        },

        set: function(str) {
            this.pageLoader.find(".js-page-loader-text").html(str);
        }
    }
});

Andamio.loader = (function () {

    "use strict";

    return {
        show: function(msg) {

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

        hide: function() {

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

            return Andamio.dom.html.hasClass("has-loader");
        },

        set status(value) {

            if (value) {
                this.show();
            }
            else {
                this.hide();
            }
        },

        get spinnerType() {

            return Andamio.config.loader.type;
        },

        set spinnerType(value) {

            Andamio.config.loader.type = value;
        },

        init: function() {

            this.status = Andamio.dom.html.hasClass("has-loader");

            var timeoutToken;

            Andamio.dom.viewport.on("Andamio:views:activateView:start", function() {

                // show loader if nothing is shown within 0,250 seconds
                timeoutToken = window.setTimeout(function() {
                    Andamio.loader.show();

                }, 250);
            });

            Andamio.dom.viewport.on("Andamio:views:activateView:finish", function() {

                window.clearTimeout(timeoutToken);
                Andamio.loader.hide();
            });
        }
    };
})();
