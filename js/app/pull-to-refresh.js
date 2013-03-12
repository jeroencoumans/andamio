/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.pulltorefresh = (function () {

    var isActive,
        isLoading,
        scrollTop,
        params;

    function setLoading(value) {

        isLoading = value;

        if (value) {
            params.scroller.addClass("is-refreshing").removeClass("can-refresh");
        } else {
            params.scroller.removeClass("is-refreshing");
        }
    }

    function onTouchMove() {

        scrollTop = params.scroller.scrollTop();

        if (scrollTop < 0 && scrollTop < params.threshold) {

            params.scroller.addClass("can-refresh");

        } else {

            params.scroller.removeClass("can-refresh");
        }
    }

    function onTouchEnd() {

        if (isLoading) {
            return;
        }

        scrollTop = params.scroller.scrollTop();

        if (scrollTop < params.threshold) {

            setLoading(true);

            Andamio.views.refreshView(null, function () {

                setLoading(false);
                params.callback();
            });
        }
    }

    return {

        get status() {
            return isActive;
        },

        enable: function () {

            isActive = true;

            if ($.isPlainObject(params)) {
                params.scroller.addClass("has-pull-to-refresh")
                    .on("touchmove", onTouchMove)
                    .on("touchend", onTouchEnd);
            }
        },

        disable: function () {

            isActive = false;

            if ($.isPlainObject(params)) {
                params.scroller.removeClass("has-pull-to-refresh")
                    .off("touchmove", onTouchMove)
                    .off("touchend", onTouchEnd);
            }
        },

        init: function (options) {

            isActive = false;

            // By default, we set the pull to refresh on the parentView
            params = {
                scroller  : Andamio.views.parentView.scroller,
                callback  : function () {},
                threshold : -50
            };

            $.extend(params, options);

            this.enable();
        }
    };
})();
