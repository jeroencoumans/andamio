/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

/**
 * Provides methods for storing HTML documents offline
 * @author Jeroen Coumans
 * @class store
 * @namespace APP
 */
Andamio.cache = (function () {

    var cache;

    function compress(s) {
        var i, l, out = '';
        if (s.length % 2 !== 0) s += ' ';
        for (i = 0, l = s.length; i < l; i += 2) {
            out += String.fromCharCode((s.charCodeAt(i) * 256) + s.charCodeAt(i + 1));
        }

        // Add a snowman prefix to mark the resulting string as encoded (more on this later)
        return String.fromCharCode(9731) + out;
    }

    function decompress(s) {
        var i, l, n, m, out = '';

        // If not prefixed with a snowman, just return the (already uncompressed) string
        if (s.charCodeAt(0) !== 9731) return s;

        for (i = 1, l = s.length; i < l; i++) {
            n = s.charCodeAt(i);
            m = Math.floor(n / 256);
            out += String.fromCharCode(m, n % 256);
        }
        return out;
    }

    return {

        get: function (key) {

            if (key && cache) {
                var result = cache.get(key);

                if (result) {
                    return decompress(result);
                }
            }
        },

        set: function (key, data, expiration) {

            if (key && data && cache) {
                var minutes = (typeof expiration === "number") ? expiration : Andamio.config.cacheExpiration;
                cache.set(key, compress(data), minutes);
            }
        },

        delete: function (key) {

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
