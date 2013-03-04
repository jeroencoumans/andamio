/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.pulltorefresh = (function () {

    var isRefreshing,
        params;

    function setRefreshing(value) {

        isRefreshing = value;

        if (value) {
            params.scroller.addClass("is-refreshing").removeClass("can-refresh");
        } else {
            params.scroller.removeClass("is-refreshing");
        }
    }

    function onTouchMove() {

        if (isRefreshing) {
            return;
        }

        var scrollTop = params.scroller.scrollTop();

        if (scrollTop < 0 && scrollTop < params.threshold && ! params.scroller.hasClass("can-refresh")) {

            params.scroller.addClass("can-refresh");

        } else if (scrollTop < 0 && scrollTop > params.threshold && params.scroller.hasClass("can-refresh")) {

            params.scroller.removeClass("can-refresh");
        }
    }

    function onTouchEnd() {

        if (isRefreshing) {
            return;
        }

        var scrollTop = params.scroller.scrollTop();

        if (scrollTop < params.threshold) {

            setRefreshing(true);

            Andamio.views.refreshView(null, function () {

                setRefreshing(false);
                params.callback();
            });
        }
    }

    return {

        get callback() {
            return params.callback;
        },

        get status() {
            return params.scroller ? params.scroller.hasClass("has-pull-to-refresh") : false;
        },

        init: function (options) {

            isRefreshing = false;

            // defaults
            params = {
                scroller  : Andamio.views.list.values.parentView.scroller,
                callback  : function () {},
                threshold : -50
            };

            $.extend(params, options);

            if (! params.scroller.hasClass("has-pull-to-refresh")) {

                params.scroller.addClass("has-pull-to-refresh");
                params.scroller.on("touchend", onTouchEnd, true);
                params.scroller.on("touchmove", onTouchMove, true);
            }
        }
    };

})();
