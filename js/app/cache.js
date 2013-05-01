/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

Andamio.cache = (function () {

    var cache;

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
                var minutes = (typeof expiration === "number") ? expiration : Andamio.config.cacheExpiration;
                cache.set(key, data, minutes);
            }
        },

        delete: function (key) {

            if (key && cache) {
                cache.remove(key);
            }
        },

        init: function () {

            cache = Andamio.config.cache ? window.lscache : false;
        }
    };
})();
