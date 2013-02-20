/*jshint es5: true, browser: true */
/*global Andamio, $ */

Andamio.util = (function () {

    function forEachIn(object, action) {
        for (var property in object) {
            if (Object.prototype.hasOwnProperty.call(object, property))
                action(property, object[property]);
        }
    }

    function Dictionary(startValues) {
        this.values = startValues || {};
    }

    Dictionary.prototype.store = function(name, value) {
        this.values[name] = value;
    };

    Dictionary.prototype.lookup = function(name) {
        return this.values[name];
    };

    Dictionary.prototype.contains = function(name) {
        return Object.prototype.hasOwnProperty.call(this.values, name) &&
        Object.prototype.propertyIsEnumerable.call(this.values, name);
    };

    Dictionary.prototype.each = function(action) {
        forEachIn(this.values, action);
    };

    return {

        Dictionary: Dictionary,

        /*
         * Get URL from the data attribute, falling back to the href
         * @method getUrl
         * @param {HTMLElement} elem the element to get the URL from
         * @return {String} Will return the URL when a `data-url` value is found, else return the href if an href is found that doesn't start with `javascript`, else return the hash if hash is found
         */
        getUrl: function(elem) {

            var url = $(elem).data("url"),
                href = $(elem).attr("href"),
                hash = $(elem).hash;

            if (url) {
                return url;
            }

            else if (href.substring(0,10) !== "javascript") {
                return href;
            }

            else if (hash) {
                return hash;
            }
        },

        /**
         * Returns an array of URL's
         * @method getUrlList
         * @param {Array} array the selector used to get the DOM elements, e.g. ".article-list .action-pjax"
         * @return {Array} an array of URL's
         */
        getUrlList: function(list) {

            if (! list) {
                return;
            }

            var urlList = [];

            $(list).each(function(index, item) {

                var url = Andamio.util.getUrl(item);
                if (url) urlList.push(url);
            });

            return urlList;
        },

        /**
         * Get title from the data attribute, falling back to the text
         * @method getTitle
         * @param {HTMLElement} elem the element to get the title from
         * @return {String} the value of `data-title` if it's found, else the text of the element
         */
        getTitle: function(elem) {

            var titleData = $(elem).data("title"),
                titleText = $(elem).text();

            return titleData ? titleData : titleText;
        },
    };
})();

Andamio.util.delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();