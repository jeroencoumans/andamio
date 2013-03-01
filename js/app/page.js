/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.page = (function () {

    function doAjaxRequest(url, expiration, callback) {

        // Cachebuster
        var requestUrl = url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();

        $.ajax({
            "url": requestUrl,
            "headers": {
                "X-PJAX": true,
                "X-Requested-With": "XMLHttpRequest"
            },

            success: function (response) {
                Andamio.cache.set(url, response, expiration);
            },

            complete: function (data) {
                callback(data.responseText);
            }
        });
    }

    return {
        load: function (url, expiration, callback) {

            if (url && $.isFunction(callback)) {

                var cachedContent = Andamio.cache.get(url);

                if (cachedContent) {

                    callback(cachedContent);

                } else {

                    doAjaxRequest(url, expiration, function (response) {
                        callback(response);
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
