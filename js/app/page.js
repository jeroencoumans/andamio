/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.page = (function () {

    var activeRequest = null;

    /**
     *
     * @method doRequest
     * @private
     * @param url {String} the URL to load.
     * @param expiration {Number} the time (in minutes) to store the content
     * @param cache {Boolean} wether to use cache busting
     * @param callback {Function} callback function that will be executed on success
     *
     */
    function doRequest(url, expiration, cache, callback) {

        // If there are still requests pending, cancel them
        if (activeRequest) {

            activeRequest.abort();
            activeRequest = null;
        }

        // Handle errors
        function onError(xhr, type) {

            // type is one of: "timeout", "error", "abort", "parsererror"
            var status = xhr.status,
                errorMessage = (type === "timeout") ? '<h3 class="alert-title">' + Andamio.i18n.offlineMessage + '</h3>': '<h3 class="alert-title">' + Andamio.i18n.ajaxGeneralError + '</h3><p>' + type + " " + status + '</p>',
                errorHTML = '<div class="alert alert-error">' + errorMessage + '<a href="javascript:void(0)" class="button button-primary button-block action-refresh">' + Andamio.i18n.ajaxRetry + '</a>';

            if (type === "timeout") {

                Andamio.connection.goOffline();
            }

            callback(errorHTML, type);
        }

        function onSuccess(response) {

            Andamio.connection.goOnline();
            Andamio.cache.set(url, response, expiration);
            callback(response);
        }

        function onComplete(xhr, status) {

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
    }

    return {

        load: function (url, expiration, cache, callback) {

            if (! url || ! $.isFunction(callback)) return;

            var cachedContent = Andamio.cache.get(url);

            if (cachedContent) {

                callback(cachedContent);
            } else {

                doRequest(url, expiration, cache, callback);
            }
        },

        refresh: function (url, expiration, callback) {

            Andamio.cache.delete(url);
            this.load(url, expiration, false, callback);
        }
    };

})();
