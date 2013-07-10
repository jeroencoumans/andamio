/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

Andamio.cache = (function () {

    var cache;

    var setBucket = function(bucket) {

        if (cache) {
            cache.setBucket(bucket);
        }
    };

    /*
     * we use a bucket with our current version string as name to store content in
     *  and we store the version string as 'content_version'
     *
     * when then version changes we flush the old bucket and then switch to the new bucket
     */
    var handleCacheVersion = function(cache_version) {
        // switch to main bucket so we can get the stored version
        setBucket('');
        // get version and check if it changed
        if (cache_version != Andamio.cache.get('app_version')) {
            // switch to old version bucket and flush
            setBucket(Andamio.cache.get('app_version'));
            Andamio.cache.flush();

            // switch to main bucket and store current/new version
            setBucket('');
            Andamio.cache.set('app_version', cache_version);
        }
        // switch to current bucket
        setBucket(cache_version);
    };

    return {

        get: function (key) {

            if (key && cache) {
                var result = cache.get(key);

                if (result) {
                    return result;
                }
            }
        },

        set: function (key, data, expiration) {

            if (key && data && cache) {
                var minutes = (typeof expiration === "number") ? expiration : Andamio.config.expiration.all;
                cache.set(key, data, minutes);
            }
        },

        remove: function (key) {

            if (key && cache) {
                cache.remove(key);
            }
        },

        flush: function () {

            if (cache) {
                cache.flush();
            }
        },

        init: function () {

            cache = Andamio.config.cache ? window.lscache : false;

            if (cache && Andamio.config.cache_version) {
                handleCacheVersion(Andamio.config.cache_version);
            }
        }
    };
})();
