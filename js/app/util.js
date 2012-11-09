APP.util = (function () {

    /**
     * Returns the value for a given query string key.
     * @todo It would be better to parse the query string once and cache the result.
     *
     * @param name Query string key
     * @param defaultValue If the query string is not found it returns this value.
     * @param queryString Query string to pick the value from, if none is provided
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
     */
    function isExternalLink(element) {

        element = $(element);

        return element.attr("target") === "_blank";
    }

    /**
     * Get URL from the data attribute, falling back to the href
     */
    function getUrl(elem) {

        var url;

        if (elem.data("url")) {
            url = elem.data("url")
        } else if (elem.attr("href")) {
            url = elem.attr("href")
        }

        if (url === "javascript:void(0)" || url === "#") {
            return false;
        } else {
            return url;
        }

    }

    return {
        "getQueryParam": getQueryParam,
        "isExternalLink": isExternalLink,
        "getUrl": getUrl
    };
})();