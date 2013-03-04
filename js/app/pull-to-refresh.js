/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.pulltorefresh = (function () {

    var isRefreshing,
        threshold,
        scroller,
        callback;

    function setRefreshing(value) {

        isRefreshing = value;

        if (value) {
            scroller.addClass("is-refreshing").removeClass("can-refresh");
        } else {
            scroller.removeClass("is-refreshing");
        }
    }

    function onTouchMove() {

        if (isRefreshing) {
            return;
        }

        var scrollTop = scroller.scrollTop();

        if (scrollTop < 0 && scrollTop < threshold && ! scroller.hasClass("can-refresh")) {

            scroller.addClass("can-refresh");

        } else if (scrollTop < 0 && scrollTop > threshold && scroller.hasClass("can-refresh")) {

            scroller.removeClass("can-refresh");
        }
    }

    function onTouchEnd() {

        if (isRefreshing) {
            return;
        }

        var scrollTop = scroller.scrollTop();

        if (scrollTop < threshold) {

            setRefreshing(true);

            Andamio.views.refreshView(null, function () {

                setRefreshing(false);
                callback();
            });
        }
    }

    return {

        get callback() {
            return callback;
        },

        set callback(callback) {
            callback = $.isFunction(callback) ? callback : function () {};
        },

        get status() {
            return scroller ? scroller.hasClass("has-pull-to-refresh") : false;
        },

        init: function (options) {

            isRefreshing = false;
            scroller     = $.isPlainObject(options) ? options.scroller : Andamio.views.list.values.parentView.scroller;
            callback     = $.isPlainObject(options) && $.isFunction(options.callback) ? options.callback : function () {};
            threshold    = $.isPlainObject(options) && typeof options.threshold === "number" ? options.threshold : -40;

            if (! scroller.hasClass("has-pull-to-refresh")) {

                scroller.addClass("has-pull-to-refresh");
                scroller.on("touchend", onTouchEnd, true);
                scroller.on("touchmove", onTouchMove, true);
            }
        }
    };

})();
