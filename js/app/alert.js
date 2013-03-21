/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

Andamio.dom.pageAlert = $(".js-page-alert");

Object.defineProperties(Andamio.dom, {

    pageAlertText: {

        get: function () {
            return this.pageAlert.find(".js-page-alert-text").text();
        },

        set: function (str) {
            this.pageAlert.find(".js-page-alert-text").html(str);
        }
    }
});

Andamio.alert = (function () {

    var isActive;

    return {
        show: function (msg) {

            if (msg) {
                Andamio.dom.pageAlertText = msg;
            }

            isActive = true;
            Andamio.dom.html.addClass("has-alert");
            Andamio.dom.pageAlert.show();
        },

        hide: function () {

            isActive = false;
            Andamio.dom.html.removeClass("has-alert");
            Andamio.dom.pageAlert.hide();
        },

        get status() {

            return isActive;
        },

        init: function () {

            isActive = Andamio.dom.html.hasClass("has-alert");
            Andamio.events.attach(".action-hide-alert", this.hide);
            Andamio.dom.doc.on("Andamio:views:activateView:start", this.hide);
        }
    };
})();
