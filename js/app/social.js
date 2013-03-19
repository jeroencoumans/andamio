/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

Andamio.social = (function () {

    var title, description, thumbnail, callback, fallback;

    function openWindow(url) {

        var width = 480,
            height = 320,
            left = (window.screen.availWidth / 2) - (width / 2),
            top = (window.screen.availHeight / 2) - (height / 2);

        window.open(url, "Share it", "left=" + left + ", top=" + top + ", width=" + width + ", height=" + height + ", centerscreen=yes");
    }

    function getThumbnail() {
        var el = Andamio.views.currentView.content.find(thumbnail);
        return el.attr("src") || el.css("background-image").slice(4, -1);
    }

    function getTitle() {
        return $.trim(Andamio.views.currentView.content.find(title).text());
    }

    function getDescription() {
        return $.trim(Andamio.views.currentView.content.find(description).text());
    }

    return {

        shareMail: function (url, subject, message, callback) {

            message += "\n\n" + url;
            fallback = encodeURI("mailto:?subject=" + subject + "&body=" + message);

            if (window.plugins && window.plugins.emailComposer) {
                window.plugins.emailComposer.showEmailComposerWithCB(callback, subject, message);
            } else {
                openWindow(fallback);
            }
        },

        shareFacebook: function (url, subject, message, callback) {

            fallback =  encodeURI("https://www.facebook.com/dialog/feed?app_id=" +
                        Andamio.config.social.facebook +
                        "&link=" + url +
                        "&name=" + subject +
                        "&caption=" + url +
                        "&picture=" + getThumbnail() +
                        "&description=" + message +
                        "&redirect_uri=" + url +
                        "&display=" + (Andamio.config.touch ? "touch" : "popup"));

            // https://github.com/phonegap/phonegap-facebook-plugin
            if (window.plugins && window.plugins.facebookConnect) {

                window.plugins.facebookConnect.dialog('feed', {
                    link: url,
                    picture: getThumbnail(),
                    name: subject,
                    caption: url,
                    description: message
                }, function (response) {

                    callback("facebook", response);
                });
            } else {
                openWindow(fallback);
            }
        },

        shareHyves: function (url, callback) {

            fallback = encodeURI("http://www.hyves.nl/respect/confirm/?hc_hint=1&url=" + url);
            openWindow(fallback);
            callback("hyves");
        },

        shareLinkedin: function (url, subject, message, callback) {

            fallback = encodeURI("http://www.linkedin.com/shareArticle?mini=true" +
                       "&url=" + url +
                       "&title=" + subject +
                       "&summary=" + message +
                       "&source=" + Andamio.config.title);
            openWindow(fallback);
            callback("linkedin");
        },

        shareTwitter: function (url, subject, message, callback) {

            message = getTitle() + " via @" + Andamio.config.social.twitter;
            fallback = encodeURI("https://twitter.com/intent/tweet?" +
                         "text=" + subject +
                         "&url=" + url +
                         "&via=" + Andamio.config.social.twitter);

            // requires https://github.com/phonegap/phonegap-plugins/tree/master/iPhone/Twitter
            if (window.plugins && window.plugins.twitter) {
                window.plugins.twitter.composeTweet(
                    function ()      { callback("twitter"); },
                    function (error) { callback("twitter", error); },
                    message, {
                        urlAttach: url,
                        imageAttach: getThumbnail()
                    });
            } else {
                openWindow(fallback);
            }
        },

        init: function (options) {

            title       = ".js-sharing-title";
            description = ".js-sharing-description";
            thumbnail   = ".js-sharing-thumbnail";
            callback    = function () {};

            if ($.isPlainObject(options)) {
                if (typeof options.title === "string")       title       = options.title;
                if (typeof options.description === "string") description = options.description;
                if (typeof options.thumbnail === "string")   thumbnail   = options.thumbnail;
                if ($.isFunction(options.callback))          callback    = options.callback;
            }

            var self = this;

            Andamio.events.attach(".action-share-email", function () {
                var url = Andamio.views.currentUrl;
                var subject = getTitle();
                var message = getDescription();

                self.shareMail(url, subject, message, callback);
            });

            Andamio.events.attach(".action-share-facebook", function () {
                var url = Andamio.views.currentUrl;
                var subject = getTitle();
                var message = getDescription();

                self.shareFacebook(url, subject, message, callback);
            });

            Andamio.events.attach(".action-share-twitter", function () {
                var url = Andamio.views.currentUrl;
                var subject = getTitle();
                var message = getDescription();

                self.shareTwitter(url, subject, message, callback);
            });
        }
    };
})();
