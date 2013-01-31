/*jshint latedef:true, undef:true, unused:true, boss:true */
/*global APP, lscache */

/**
 * Provides methods for storing HTML documents offline
 * @author Jeroen Coumans
 * @class store
 * @namespace APP
 */
APP.store = (function() {

    /**
     * Wrapper around lscache.set
     * Note that this is fire and forget, there are no checks done to verify it's actually set
     */
    function setCache(key, data, expiration) {

        if (! key || ! data) return;

        var seconds = (typeof expiration === "number") ? expiration : 24 * 60 * 60;

        lscache.set(key, data, seconds);
        APP.dom.doc.trigger("APP:store:setCache", key);
    }

    /**
     * Wrapper around lscache.get
     */
    function getCache(key) {

        if (! key) return;

        var result = lscache.get(key);
        if (result) {

            APP.dom.doc.trigger("APP:store:getCache", key);
            return result;
        }
    }

    /**
     * Wrapper around lscache.remove
     */
    function deleteCache(key) {

        if (! key) return;
        lscache.remove(key);
    }

    return {
        "setCache": setCache,
        "getCache": getCache,
        "deleteCache": deleteCache
    };

})();