/*jshint es5: true, browser: true, undef:true, unused:true, strict:true */
/*global Andamio */

/**
 * Provides methods for storing HTML documents offline
 * @author Jeroen Coumans
 * @class store
 * @namespace APP
 */
Andamio.cache = (function () {

    "use strict";

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
                var minutes = (typeof expiration === "number") ? expiration : 2 * 60;
                cache.set(key, data, minutes);
            }
        },

        deleteCache: function (key) {

            if (key && cache) {
                cache.remove(key);
            }
        },

        init: function () {

            cache = window.lscache || false;
            Andamio.config.cache = cache ? cache.supported() : false;
        }
    };
})();
