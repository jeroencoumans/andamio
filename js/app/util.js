/**
 * Various utility functions
 * @author Jeroen Coumans
 * @class util
 * @namespace APP
 */
APP.util = (function () {

    /**
     * Returns the value for a given query string key.
     * @method getQueryParam
     * @todo It would be better to parse the query string once and cache the result.
     *
     * @param {String} name Query string key
     * @param {String} defaultValue If the query string is not found it returns this value.
     * @param {String} queryString Query string to pick the value from, if none is provided
     *                    window.location.search query string will be used. This
     *                    parameter makes the function testable.
     *
     * @return The value of the query string or defaultValue if the key is
     *         not found. If the value is empty an empty string is returned.
     */
    function getQueryParam(name, defaultValue, queryString) {

        if (!queryString) {
            queryString = window.location.search;
        }
        var match = RegExp("[?&]" + name + "=([^&]*)").exec(queryString);

        return match ?
            decodeURIComponent(match[1].replace(/\+/g, " "))
            : defaultValue;
    }

    /**
     * Returns whether the given (anchor) element contains an external link
     * @method isExternalLink
     * @param {HTMLElement} elem an anchor element
     * @return {Boolean} true when the anchor contains `target="_blank"`
     */
    function isExternalLink(elem) {

        var element = $(elem);

        return element.attr("target") === "_blank";
    }

    /**
     * Get URL from the data attribute, falling back to the href
     * @method getUrl
     * @param {HTMLElement} elem the element to get the URL from
     * @return {String} Will return the URL when a `data-url` value is found, else return the href if an href is found that doesn't start with `javascript`, else return the hash if hash is found
     */
    function getUrl(elem) {

        var url = $(elem).data("url"),
            href = $(elem).attr("href"),
            hash = $(elem).hash;

        if (url) { return url; }
        else if (href.substring(0,10) !== "javascript") { return href; }
        else if (hash) { return hash; }
    }

    /**
     * Get title from the data attribute, falling back to the text
     * @param {HTMLElement} elem the element to get the title from
     * @return {String} the value of `data-title` if it's found, else the text of the element
     */
    function getTitle(elem) {

        var title;

        if (elem.data("title")) {
            title = elem.data("title");
        } else if (elem.text()) {
            title = elem.text();
        }

        return title;
    }

    return {
        "getQueryParam": getQueryParam,
        "isExternalLink": isExternalLink,
        "getUrl": getUrl,
        "getTitle": getTitle
    };
})();

/**
 * Executes the callback function after a specified delay
 * @author Jeroen Coumans
 * @class delay
 * @namespace APP
 * @param {Integer} timer the delay in milliseconds after which to execute the callback
 */
APP.delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();