/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.pulltorefresh = (function () {

    var isActive,
        isLoading,
        scrollTop,
        options;

    function onTouchStart() {

        // store the scrollTop to determine if we need to set a timeout or not
        scrollTop = options.scroller[0].scrollTop;
    }

    function onTouchMove() {

        // don't bother doing anything if the stored scrollTop wouldn't result in an actual PTR
        if (scrollTop > options.offset) return;

        scrollTop = options.scroller[0].scrollTop;

        if (scrollTop < options.threshold) {

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

        if (scrollTop > options.offset) return;

        scrollTop = options.scroller[0].scrollTop;

        if (scrollTop < options.threshold) {

            isLoading = true;
            options.scroller.addClass("is-refreshing").removeClass("can-refresh");
            Andamio.views.currentView.content[0].innerHTML = "";
            Andamio.loader.show();

            // Set a hardcoded delay to actually refresh, since it sometimes happens so fast it causes a jarring experience
            Andamio.util.delay(function () {
                Andamio.views.refreshView(Andamio.views.currentView, null, onRefreshEnd);
            }, 300);
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
            options.scroller.addClass("has-pull-to-refresh")
                .on("touchmove", onTouchMove)
                .on("touchstart", onTouchStart)
                .on("touchend", onTouchEnd);
        },

        disable: function () {

            isActive = false;
            options.scroller.removeClass("has-pull-to-refresh")
                .off("touchmove", onTouchMove)
                .off("touchstart", onTouchStart)
                .off("touchend", onTouchEnd);
        },

        init: function (params) {

            isActive = false;

            // By default, we set the pull to refresh on the parentView
            options = {
                scroller  : Andamio.views.parentView.scroller,
                callback  : function () {},
                threshold : -50,
                offset    : 150
            };

            $.extend(options, params);

            this.enable();
        }
    };
})();
