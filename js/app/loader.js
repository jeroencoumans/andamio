/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

Andamio.loader = (function () {

    var isActive;

    return {
        show: function (msg) {

            isActive = true;

            if (msg) {
                Andamio.dom.pageLoaderText = msg;
            }

            if (Andamio.config.tmgcontainer) {
                if (navigator.spinner) {
                    navigator.spinner.show({"message": msg});
                }
            }
            else {
                Andamio.dom.pageLoader.removeClass("display-none");
            }
        },

        hide: function () {

            isActive = false;

            if (Andamio.config.tmgcontainer) {
                if (navigator.spinner) {
                    navigator.spinner.hide();
                }
            }
            else {
                Andamio.dom.pageLoader.addClass("display-none");
            }
        },

        get status() {

            return isActive;
        },

        init: function () {

            // Register DOM references
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

            // Setup initial state
            isActive = false;

            var self = this,
                timeoutToken;

            // Register event handlers
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
