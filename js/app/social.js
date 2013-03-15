/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

Andamio.social = (function () {

    var title, description, serviceUrl, url, subject, message, callback;

    function openWindow(url) {

        var width = 480,
            height = 320,
            left = (window.screen.availWidth / 2) - (width / 2),
            top = (window.screen.availHeight / 2) - (height / 2);

        window.open(url, "Share it", "left=" + left + ", top=" + top + ", width=" + width + ", height=" + height + ", centerscreen=yes");
    }

    function sharePage(service, serviceUrl, url, subject, message, callback) {

        if (navigator.social) {
            navigator.social.shareUrl(service, serviceUrl, url, subject, message, function (result) {

                if (navigator.social.RESULT_OK === result) {

                    if ($.isFunction(callback)) {
                        callback(service);
                    }

                } else if (navigator.social.RESULT_ERROR === result) {

                    if ($.isFunction(callback)) {
                        callback(service);
                    }

                    navigator.utility.openUrl(serviceUrl, "popover");
                }
            });
        } else {

            openWindow(serviceUrl);

            if ($.isFunction(callback)) {
                callback(service);
            }
        }
    }

    function getTitle() {
        return $.trim(Andamio.views.currentView.content.find(title).text());
    }

    function getDescription() {
        return $.trim(Andamio.views.currentView.content.find(description).text());
    }

    return {

        // Figure out what the service is and pass around the correct params
        share: function (service, callback) {

            url = Andamio.views.currentUrl;
            subject = getTitle();
            message = getDescription();

            switch (service) {

            case "hyves":

                serviceUrl = encodeURI("http://www.hyves.nl/respect/confirm/?hc_hint=1&url=" + url);
                sharePage("hyves", serviceUrl, url, "", "", callback);
                break;
            case "facebook":

                var display = Andamio.config.touch ? "touch" : "popup";
                serviceUrl = encodeURI("https://www.facebook.com/dialog/feed?app_id=" +
                             Andamio.config.social.facebook +
                             "&link=" + url +
                             "&name=" + subject +
                             "&caption=" + url +
                             "&description=" + message +
                             "&redirect_uri=" + url +
                             "&display=" + display);

                sharePage("facebook", serviceUrl, url, "", subject, callback);
                break;
            case "twitter":

                message = getTitle() + " %url - via @" + Andamio.config.social.twitter;
                serviceUrl = encodeURI("https://twitter.com/intent/tweet?" +
                             "text=" + subject +
                             "&url=" + url +
                             "&via=" + Andamio.config.social.twitter);

                sharePage("twitter", serviceUrl, url, "", message, callback);

                break;
            case "email":

                message += "\n\n" + url;
                serviceUrl = encodeURI("mailto:?subject=" + subject + "&body=" + message);
                sharePage("email", serviceUrl, url, subject, message, callback);
                break;
            case "linkedin":

                serviceUrl = encodeURI("http://www.linkedin.com/shareArticle?mini=true" +
                             "&url=" + url +
                             "&title=" + subject +
                             "&summary=" + message +
                             "&source=" + Andamio.config.title);
                sharePage("linkedin", serviceUrl, url, "", message, callback);
                break;
            }
        },

        init: function (options) {

            title       = ".js-sharing-title";
            description = ".js-sharing-description";
            callback    = function () {};

            if ($.isPlainObject(options)) {
                if (typeof options.title === "string")       title       = options.title;
                if (typeof options.description === "string") description = options.description;
                if ($.isFunction(options.callback))          callback    = options.callback;
            }

            var self = this;

            function shareButton(event, service, callback) {
                var target = $(event.currentTarget);

                if (! target.hasClass("button-disabled")) {
                    self.share(service, function () {
                        target.addClass("button-disabled");
                        callback();
                    });
                }
            }

            Andamio.events.attach(".action-share-facebook", function (e) { shareButton(e, "facebook", callback); });
            Andamio.events.attach(".action-share-twitter",  function (e) { shareButton(e, "twitter",  callback); });
            Andamio.events.attach(".action-share-hyves",    function (e) { shareButton(e, "hyves",    callback); });
            Andamio.events.attach(".action-share-email",    function (e) { shareButton(e, "email",    callback); });
            Andamio.events.attach(".action-share-linkedin", function (e) { shareButton(e, "linkedin", callback); });
        }
    };
})();
