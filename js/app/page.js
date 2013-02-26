/*jshint es5: true, browser: true, undef:true, unused:true */
/*global Andamio, $ */

Andamio.page = (function () {

    /**
     * Stores content in cache based on URL
     */
    function storeResponse (url, response, expiration) {

        if (Andamio.config.cache) {
            Andamio.cache.setCache(url, response, expiration);
        }
    }

    /**
     * Ajax request to URL, storing the result in cache on success. Fails silently.
     */
    function doAjaxRequest (url, expiration, callback) {

        // Add cachebuster
        var requestUrl = url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();

        $.ajax({
            "url": requestUrl,
            "timeout": 10000,
            "headers": {
                "X-PJAX": true,
                "X-Requested-With": "XMLHttpRequest"
            },

            success: function (response) {
                storeResponse(url, response, expiration);
            },

            complete: function (data) {
                if ($.isFunction(callback)) callback(data.responseText);
            }
        });
    }


    /**
     * Returns the content from url, storing it when it's not stored yet
     * @method getContent
     * @param url {String} URL to load
     * @param expiration {Integer} how long (in minutes) the content can be cached when retrieving
     * @param callback {Function} optional callback function that receives the content
     */
    return {
        load: function (url, expiration, callback) {

            if (! url) {
                return false;
            }

            // try to get the cached content first
            var cachedContent = Andamio.cache.getCache(url);

            if (cachedContent) {

                if ($.isFunction(callback)) {
                    callback(cachedContent);
                }
            } else {

                doAjaxRequest(url, expiration, function (response) {

                    if ($.isFunction(callback)) {
                        callback(response);
                    }
                });
            }
        },

        refresh: function (url, expiration, callback) {

            Andamio.cache.deleteCache(url);
            this.load(url, expiration, callback);
        }
    };

})();
