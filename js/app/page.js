/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.dom.refreshDate = $(".js-refresh-date");

Andamio.page = (function () {

    var updateTimestamp, updateTimer;

    function doAjaxRequest(url, expiration, cache, callback) {

        $.ajax({
            url: url,
            cache: cache,
            headers: {
                "X-PJAX": true,
                "X-Requested-With": "XMLHttpRequest"
            },

            error: function (xhr, type) {

                // type is one of: "timeout", "error", "abort", "parsererror"
                var status = xhr.status,
                    errorMessage = '<a href="javascript:void(0)" class="action-refresh">' + Andamio.i18n.ajaxGeneralError + '<br>' + type + " " + status + '<br>' + Andamio.i18n.ajaxRetry + '</a>';

                if (type === "timeout") {
                    Andamio.connection.goOffline();
                } else {
                    if (Andamio.connection.status) {
                        Andamio.alert.show(errorMessage);
                    }
                }
            },

            success: function (response) {
                Andamio.connection.goOnline();
                Andamio.cache.set(url, response, expiration);
                callback(response);
            }
        });
    }

    return {
        get lastUpdate() {
            return updateTimestamp;
        },

        set lastUpdate(date) {

            updateTimestamp = (date instanceof Date) ? date : new Date();
            Andamio.dom.refreshDate.text(Andamio.util.relativeDate(updateTimestamp));
        },

        load: function (url, expiration, cache, callback) {

            clearInterval(updateTimer);

            var doCallback = function(response) {

                self.lastUpdate = new Date();
                updateTimer = window.setInterval(function () {
                    Andamio.dom.refreshDate.text(Andamio.util.relativeDate(self.lastUpdate));
                }, 60000);

                if ($.isFunction(callback)) callback(response);
            };

            if (url) {

                var cachedContent = Andamio.cache.get(url),
                    self = this;

                if (cachedContent) {

                    doCallback(cachedContent);
                } else {

                    doAjaxRequest(url, expiration, cache, function (response) {

                        doCallback(response);
                    });
                }
            }
        },

        refresh: function (url, expiration, callback) {

            Andamio.cache.delete(url);
            this.load(url, expiration, false, callback);
        }
    };

})();
