/*jshint es5: true, browser: true, undef:true, unused:true */
/*global Andamio */

/**
 * Provides methods for storing HTML documents offline
 * @author Jeroen Coumans
 * @class store
 * @namespace APP
 */
Andamio.cache = (function () {

    var cache;

    return {

        getCache: function (key) {

            if (key && cache) {
                var result = cache.get(key);

                if (result) {
                    return result;
                }
            }
        },

        setCache: function (key, data, expiration) {

            if (key && data && cache) {
                var minutes = (typeof expiration === "number") ? expiration : Andamio.config.cacheExpiration;
                cache.set(key, data, minutes);
            }
        },

        deleteCache: function (key) {

            if (key && cache) {
                cache.remove(key);
            }
        },

        init: function () {

            if (Andamio.config.cache) {

                cache = window.lscache;
                Andamio.config.cacheExpiration = 120;
            } else {
                cache = false;
            }
        }
    };
})();
