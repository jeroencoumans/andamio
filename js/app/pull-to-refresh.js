/*jshint browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.pulltorefresh = (function () {

    function PullToRefresh(view, options) {

        if (! view.scroller) {
            throw "view must have a scroller";
        }

        this.view           = view;
        this.scrollCache    = 0;
        this.options        = options;
        this.active         = false;
        this.loading        = false;

        this.enable();
    }

    PullToRefresh.prototype = {

        enable: function () {

            this.active = true;
            this.loading = false;

            this.view.scroller
                .addClass("has-pull-to-refresh")
                .on("touchmove",    $.proxy(this.onTouchMove, this))
                .on("touchstart",   $.proxy(this.onTouchStart, this))
                .on("touchend",     $.proxy(this.onTouchEnd, this));

        },

        disable: function () {

            this.view.scroller
                .removeClass("has-pull-to-refresh")
                .off("touchmove",   $.proxy(this.onTouchMove, this))
                .off("touchstart",  $.proxy(this.onTouchStart, this))
                .off("touchend",    $.proxy(this.onTouchEnd, this));

            this.active = false;
            this.loading = false;
        },

        onTouchStart: function () {

            // cache the scrollTop to determine if we need to set a timeout or not
            this.scrollCache = this.view.scrollPosition;
        },

        onTouchMove: function () {

            // don't bother doing anything if the stored scrollTop wouldn't result in an actual PTR
            if (this.scrollCache > this.options.offset) return;

            // start live listening
            if (this.view.scrollPosition < this.options.threshold) {

                this.view.scroller.addClass("can-refresh");
            } else {

                this.view.scroller.removeClass("can-refresh");
            }
        },

        onTouchEnd: function () {

            // cache the last scrollTop again
            this.scrollCache = this.view.scrollPosition;

            if (this.scrollCache > this.options.offset) return;

            if (this.scrollCache < this.options.threshold) {

                this.loading = true;
                this.view.scroller.addClass("is-refreshing").removeClass("can-refresh");
                Andamio.views.currentView.content[0].innerHTML = "";
                Andamio.loader.show();

                var onRefreshEnd = this.onRefreshEnd.call(this);

                // Set a hardcoded delay to actually refresh, since it sometimes happens so fast it causes a jarring experience
                Andamio.util.delay(function () {
                    Andamio.views.refreshView(Andamio.views.currentView, onRefreshEnd);
                }, 300);
            }
        },

        onRefreshEnd: function () {

            this.loading = false;
            this.view.scroller.removeClass("is-refreshing");
            this.options.callback();
        }

    };

    return {

        init: function (view, params) {

            // By default, we set the pull to refresh on the parentView
            var options = {
                callback  : function () {},
                threshold : -50,
                offset    : 150
            };

            $.extend(options, params);

            return new PullToRefresh(view, options);
        }
    };
})();
