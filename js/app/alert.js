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

/**
 * Controls global alerts
 * @author Jeroen Coumans
 * @class alert
 * @namespace Andamio
 */
Andamio.alert = (function () {

    var isActive;

    return {

        /**
         * Show alert
         * @method show
         * @param {String} msg the message of the alert
         */
        show: function (msg) {

            if (msg) {
                Andamio.dom.pageAlertText = msg;
            }

            isActive = true;
            Andamio.dom.html.addClass("has-alert");
            Andamio.dom.pageAlert.show();
        },

        /**
         * Hide alert
         * @method hide
         */
        hide: function () {

            isActive = false;
            Andamio.dom.html.removeClass("has-alert");
            Andamio.dom.pageAlert.hide();
        },

        /**
         * Status of alert
         * @method status
         * @return {Boolean} true when alert is displayed, false when alert is hidden
         */
        get status() {

            return isActive;
        },

        /**
         * Initialize variables and attach listeners
         * @method init
         */
        init: function () {

            isActive = Andamio.dom.html.hasClass("has-alert");
            Andamio.events.attach(".action-hide-alert", this.hide);
            Andamio.dom.doc.on("Andamio:views:activateView:start", this.hide);
        }
    };
})();
