/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.pulltorefresh = (function () {

    var isRefreshing,
        pullEl,
        pullThreshold,
        scrollWrapper,
        scrollContent,
        refreshCallback;

    function onTouchMove() {

        if (isRefreshing) {
            return;
        }

        var scrollTop = scrollWrapper.scrollTop();

        if (scrollTop < 0 && scrollTop < pullThreshold && ! pullEl.hasClass("can-refresh")) {

            pullEl.addClass("can-refresh");

        } else if (scrollTop < 0 && scrollTop > pullThreshold && pullEl.hasClass("can-refresh")) {

            pullEl.removeClass("can-refresh");
        }
    }

    function onTouchEnd() {

        if (isRefreshing) {
            return;
        }

        var scrollTop = scrollWrapper.scrollTop();

        if (scrollTop < pullThreshold) {

            isRefreshing = true;
            pullEl.addClass("is-refreshing");

            Andamio.views.refreshView(null, function () {

                isRefreshing = false;
                pullEl.removeClass("can-refresh is-refreshing");
                refreshCallback();
            });
        }
    }

    return {

        get callback() {
            return refreshCallback;
        },

        set callback(callback) {
            refreshCallback = $.isFunction(callback) ? callback : function () {};
        },

        init: function (options) {

            isRefreshing    = false;
            pullEl          = $.isPlainObject(options) ? options.pullEl : Andamio.views.list.values.parentView.scroller.find(".js-pull-to-refresh");
            scrollWrapper   = $.isPlainObject(options) ? options.scrollWrapper : Andamio.views.list.values.parentView.scroller;
            scrollContent   = $.isPlainObject(options) ? options.scrollContent : Andamio.views.list.values.parentView.content;
            refreshCallback = $.isPlainObject(options) && $.isFunction(options.callback) ? options.callback : function () {};
            pullThreshold   = $.isPlainObject(options) && typeof options.pullThreshold === "number" ? options.pullThreshold : -50;

            if (! scrollWrapper.hasClass("has-pull-to-refresh")) {

                scrollWrapper.addClass("has-pull-to-refresh");
                scrollWrapper.on("touchend", onTouchEnd, true);
                scrollWrapper.on("touchmove", onTouchMove, true);
            }
        }
    };

})();