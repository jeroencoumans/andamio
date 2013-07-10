/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.page = (function () {

    var activeRequest = null;

    return {

        get activeRequest() {
            return activeRequest;
        },

        abortRequest: function () {
            if (activeRequest) {

                activeRequest.abort();
                activeRequest = null;
            }
        },

        doRequest: function (url, expiration, cache, callback) {

            var onError = function (xhr, type) {

                // type is one of: "timeout", "error", "abort", "parsererror"
                var status = xhr.status,
                    errorMessage = (type === "timeout") ? '<h3 class="alert-title">' + Andamio.i18n.ajaxTimeout + '</h3>': '<h3 class="alert-title">' + Andamio.i18n.ajaxGeneralError + '</h3><p>' + type + " " + status + '</p>',
                    errorHTML = '<div class="alert alert-error">' + errorMessage + '<a href="javascript:void(0)" class="button button-primary button-block action-refresh">' + Andamio.i18n.ajaxRetry + '</a>';

                if (type === "timeout") {

                    Andamio.connection.goOffline();
                }

                // Pass the errorHTML and error type to the callback
                callback(errorHTML, type);
            },

            onSuccess = function (response) {

                Andamio.connection.goOnline();
                Andamio.cache.set(url, response, expiration);
                callback(response);
            },

            onComplete = function () {

                activeRequest = null;
            };

            var headers = {
                "X-PJAX": true,
                "X-Requested-With": "XMLHttpRequest",
                "X-Fast-Connection": Andamio.connection.isFast
            };

            if (Andamio.config.custom_headers) {
                $.each(Andamio.config.custom_headers, function(k, v) {
                        headers[k] = $.isFunction(v) ? v() : v;
                })
            }

            activeRequest = $.ajax({
                url: url,
                cache: cache,
                headers: headers,
                error: onError,
                success: onSuccess,
                complete: onComplete
            });
        },

        /**
         * This method should be the preferred way of loading a new page.
         * It takes care of retrieving a URL from the server, and storing it for a specified time in cache
         * If the URL has already been stored, it will return the content from cache
         *
         * @method load
         * @param url {String} the URL that should be loaded
         * @param expiration {Number} the number of minutes that the response will be cached (after that, it will be fetched from the server again)
         * @param cache {Boolean} true if the request may retrieve a cached Ajax response, false to force an update (by appending the current timestamp to the URL)
         * @param callback {Function} function that receives the response; this function should accept two parameters: the first is the content, the second is the errorType (if any)
         */
        load: function (url, expiration, cache, callback) {

            var cachedContent = Andamio.cache.get(url);

            if (cachedContent) {

                callback(cachedContent);
            } else {

                this.doRequest(url, expiration, cache, callback);
            }
        },

        /**
         * This method should be the preferred way of refreshing a page.
         * It always does an Ajax request and forces the server to send an updated version (by appending the current timestamp)
         * Should the request fail, it will return the cached content (if any)
         *
         * @method refresh
         * @param url {String} the URL that should be reloaded
         * @param expiration {Number} the number of minutes that the response will be cached (after that, it will be fetched from the server again)
         * @param callback {Function} function that receives the response; this function should accept two parameters: the first is the content, the second is the errorType (if any)
         */
        refresh: function (url, expiration, callback) {

            var cachedContent = Andamio.cache.get(url);

            if (cachedContent) {

                this.doRequest(url, expiration, false, function (response, error) {

                    if (error) {
                        callback(cachedContent, error);
                    } else {
                        callback(response);
                    }
                });

            } else {

                this.doRequest(url, expiration, false, callback);
            }
        }
    };

})();
