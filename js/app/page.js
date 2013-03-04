/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.page = (function () {

    function doAjaxRequest(url, expiration, callback) {

        $.ajax({
            "url": url,
            "timeout": 0,
            "headers": {
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
        load: function (url, expiration, callback) {

            if (url) {

                var cachedContent = Andamio.cache.get(url);

                if (cachedContent) {

                    if ($.isFunction(callback)) callback(cachedContent);
                } else {

                    doAjaxRequest(url, expiration, function (response) {
                        if ($.isFunction(callback)) callback(response);
                    });
                }
            }
        },

        refresh: function (url, expiration, callback) {

            Andamio.cache.delete(url);
            this.load(url, expiration, callback);
        }
    };

})();
