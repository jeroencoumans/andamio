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

            // If there are still requests pending, cancel them
            this.abortRequest();

            function onError(xhr, type) {

                // type is one of: "timeout", "error", "abort", "parsererror"
                var status = xhr.status,
                    errorMessage = (type === "timeout") ? '<h3 class="alert-title">' + Andamio.i18n.ajaxTimeout + '</h3>': '<h3 class="alert-title">' + Andamio.i18n.ajaxGeneralError + '</h3><p>' + type + " " + status + '</p>',
                    errorHTML = '<div class="alert alert-error">' + errorMessage + '<a href="javascript:void(0)" class="button button-primary button-block action-refresh">' + Andamio.i18n.ajaxRetry + '</a>';

                if (type === "timeout") {

                    Andamio.connection.goOffline();
                }

                // Pass the errorHTML and error type to the callback
                callback(errorHTML, type);
            }

            function onSuccess(response) {

                Andamio.connection.goOnline();
                Andamio.cache.set(url, response, expiration);
                callback(response);
            }

            function onComplete() {

                activeRequest = null;
            }

            activeRequest = $.ajax({
                url: url,
                cache: cache,
                headers: {
                    "X-PJAX": true,
                    "X-Requested-With": "XMLHttpRequest"
                },
                error: onError,
                success: onSuccess,
                complete: onComplete
            });
        },

        load: function (url, expiration, cache, callback) {

            if (! url || ! $.isFunction(callback)) return;

            var cachedContent = Andamio.cache.get(url);

            if (cachedContent) {

                callback(cachedContent);
            } else {

                this.doRequest(url, expiration, cache, callback);
            }
        },

        refresh: function (url, expiration, callback) {

            if (! url || ! $.isFunction(callback)) return;

            var cachedContent = Andamio.cache.get(url);

            if (cachedContent) {

                this.doRequest(url, expiration, false, function (response, error) {

                    callback(error ? cachedContent : response);
                });

            } else {

                this.doRequest(url, expiration, false, callback);
            }
        }
    };

})();
