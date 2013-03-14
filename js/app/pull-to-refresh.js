/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.pulltorefresh = (function () {

    var isActive,
        isLoading,
        scrollTop,
        options;

    function onTouchMove() {

        scrollTop = options.scroller.scrollTop();

        if (scrollTop < 0 && scrollTop < options.threshold) {

            options.scroller.addClass("can-refresh");
        } else {

            options.scroller.removeClass("can-refresh");
        }
    }

    function onRefreshEnd() {

        isLoading = false;
        options.scroller.removeClass("is-refreshing");
        options.callback();
    }

    function onTouchEnd() {

        scrollTop = options.scroller.scrollTop();

        if (scrollTop < options.threshold) {

            isLoading = true;
            options.scroller.addClass("is-refreshing").removeClass("can-refresh");
            Andamio.views.refreshView(null, onRefreshEnd);
        }
    }

    return {

        get status() {
            return isActive;
        },

        get loading() {
            return isLoading;
        },

        get options() {

            return options;
        },

        enable: function () {

            isActive = true;

            if ($.isPlainObject(options)) {
                options.scroller.addClass("has-pull-to-refresh")
                    .on("touchmove", onTouchMove)
                    .on("touchend", onTouchEnd);
            }
        },

        disable: function () {

            isActive = false;

            if ($.isPlainObject(options)) {
                options.scroller.removeClass("has-pull-to-refresh")
                    .off("touchmove", onTouchMove)
                    .off("touchend", onTouchEnd);
            }
        },

        init: function (params) {

            isActive = false;

            // By default, we set the pull to refresh on the parentView
            options = {
                scroller  : Andamio.views.parentView.scroller,
                callback  : function () {},
                threshold : -50
            };

            $.extend(options, params);

            this.enable();
        }
    };
})();
