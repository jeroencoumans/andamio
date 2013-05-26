/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.util = (function () {

    return {

        last: function (list) {
            if (list.length > 0) {
                return list[list.length - 1];
            }
        },

        prev: function (list) {
            if (list && list.length > 1) {
                return list[list.length - 2];
            }
        },

        addUniq: function (value, list) {
            if (value !== this.last(list)) {
                list.push(value);
            }
        },

        addOnly: function (value, list) {

            if (list.indexOf(value) < 0) {
                list.push(value);
            }
        },

        /*
         * Get URL from the data attribute, falling back to the href
         * @method getUrl
         * @param {HTMLElement} elem the element to get the URL from
         * @return {String} Will return the URL when a `data-url` value is found, else return the href if an href is found that doesn't start with `javascript`, else return the hash if hash is found
         */
        getUrl: function (elem) {

            var href = $(elem).attr("href").indexOf("javascript") !== 0 ? $(elem).attr("href") : false;
            return $(elem).data("url") || href || $(elem).hash;
        },

        /**
         * Get title from the data attribute, falling back to the text
         * @method getTitle
         * @param {HTMLElement} elem the element to get the title from
         * @return {String} the value of `data-title` if it's found, else the text of the element
         */
        getTitle: function (elem) {

            return $(elem).data("title") || $(elem).text();
        }

    };
})();

Andamio.util.delay = (function () {
    var timer = 0;

    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
