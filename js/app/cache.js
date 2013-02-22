/*jshint es5: true, browser: true */
/*global Andamio */

/**
 * Provides methods for storing HTML documents offline
 * @author Jeroen Coumans
 * @class store
 * @namespace APP
 */
Andamio.cache = (function() {

    "use strict";

    var cache;

    return {

        getCache: function(key) {

            if (! key) {
                return;
            }

            var result = cache.get(key);

            if (result) {
                return result;
            }
        },

        setCache: function(key, data, expiration) {

            if (! key || ! data) {
                return;
            }

            var minutes = (typeof expiration === "number") ? expiration : 2 * 60;

            cache.set(key, data, minutes);
        },

        deleteCache: function(key) {

            if (! key) {
                return;
            }

            cache.remove(key);
        },

        init: function() {

            if (window.lscache) {
                Andamio.config.cache = window.lscache.supported();
                cache = window.lscache;
            }
        }
    };
})();
