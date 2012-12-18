/**
 * Provides methods for storing HTML documents offline
 * @author Jeroen Coumans
 * @class store
 * @namespace APP
 */
APP.store = (function() {

    var server,
        isLoading;

    /**
     * @method loading
     * @return {Boolean} wether we're currently loading
     */
    function loading() {

        return isLoading;
    }

    /**
     * Loads an URL from localStorage.
     * @method showUrl
     * @param {String} url the URL that will be loaded. The URL is used as the key. The value will be parsed as JSON.
     * @param {Boolean} loaded wether or not to load silently (default) or show a loader when fetching the URL
     * @return {String} the value that was stored. Usually, this is raw HTML.
     */
    function showUrl(url, loader, callback) {

        if (! url) return;

        // set result
        var result = lscache.get(url);

        if (result) {

            callback(result);
        } else {

            if (loader) APP.loader.show();
            // console.log("Article wasn't stored, storing it now...");

            storeUrl(url, false, false, function(status) {

                // console.log("Article stored, calling showUrl again...");

                if (status === "success") {

                    if (loader) APP.loader.hide();
                    var result = lscache.get(url);

                    callback(result);
                } else {

                    APP.alert.show("Couldn't load article");
                }
            });
        }
    }

    /**
     * Does an AJAX call to URL and stores it with the URL as the key
     * @method storeUrl
     * @param {String} url the URL to be stored
     * @param {Boolean} [absolute] if false, the server will be prefixed to URL's
     * @param {Integer} [expiration=365*24*60] after how long should the stored URL expire. Set in minutes, defaults to 1 year.
     * @param {Function} [callback] callback function when the AJAX call is complete
    */
    function storeUrl(url, absolute, expiration, callback) {

        if (! url || lscache.get(url)) return;

        var expire = expiration ? expiration : 365*24*60,
            request = absolute ? url : server + url;

        $.ajax({
            url: request,
            timeout: 20000,
            global: false, // don't fire off global AJAX events, we want to load in the background
            headers: { "X-PJAX": true },
            beforeSend: function() {

                isLoading = true;
            },
            success: function(response) {

                lscache.set(url, response, expire);
            },
            complete: function(xhr,status) {

                isLoading = false;

                if ($.isFunction(callback)) callback(status);
            }
        });
    }

    /**
     * Wrapper around storeUrl to store an array of URLs
     * @method storeUrlList
     * @param {Array} list an array of URL's
     * @param {Boolean} [absolute] if false, the server will be prefixed to URL's
     * @param {Integer} [expiration=365*24*60] after how long should the stored URL expire. Set in minutes, defaults to 1 year.
     * @param {Function} [callback] callback function when the AJAX call is complete
     */
    function storeUrlList(list, absolute, expiration, callback) {

        if (! list) return;

        // TODO: show progress meter
        // var loaded = 0;

        $(list).each(function(index, item) {

            storeUrl(item, absolute, expiration, function(status) {
                if (status === "success") {
                    // loaded++;
                    // var loadedPercentage = Math.round(loaded / list.length * 100) + "%";
                    // console.log(loadedPercentage);
                } else {
                    // console.log(status);
                }
            });
        });

        if ($.isFunction(callback)) callback();
    }

    /**
     * Returns an array of URL's
     * @method getUrlList
     * @param {HTMLElement} selector the selector used to get the DOM elements, e.g. ".article-list .action-pjax"
     * @return {Array} an array of URL's
     */
    function getUrlList(selector) {

        if (! selector) return;

        var urlList = [];

        $(selector).each(function(index, item) {

            var url = APP.util.getUrl(item);
            urlList.push(url);
        });

        return urlList;
    }

    /**
     * Initialize variables and settings
     * @method init
     * @param {Object} [params.server] optional server that will be used as the default host
     */
    function init(params) {

        isLoading = false;
        server = (params && params.server) ? params.server : "http://localhost";
    }

    return {
        "init": init,
        "loading": loading,
        "storeUrl": storeUrl,
        "storeUrlList": storeUrlList,
        "getUrlList": getUrlList,
        "showUrl": showUrl
    };

})();
