/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.pulltorefresh = (function () {

    var isRefreshing,
        scrollTop,
        updateTimestamp,
        now,
        updateEl,
        updateInterval,
        params;

    function setRefreshing(value) {

        isRefreshing = value;

        if (value) {
            params.scroller.addClass("is-refreshing").removeClass("can-refresh");
        } else {
            params.scroller.removeClass("is-refreshing");
        }
    }

    function setLastUpdate(date) {

        updateTimestamp = (date instanceof Date) ? date : updateTimestamp;
        now = new Date();

        if (now - updateTimestamp > 1000) {
            updateEl.text(Andamio.util.relativeDate(updateTimestamp));
        }
    }

    function cancelLastUpdate() {

        clearInterval(updateInterval);
        updateInterval = false;
    }

    function toggleRefresh() {

        scrollTop = params.scroller.scrollTop();

        if (scrollTop >= 0) {

            cancelLastUpdate();

        } else {

            if (scrollTop < params.threshold) {

                params.scroller.addClass("can-refresh");

            } else {

                params.scroller.removeClass("can-refresh");
            }
        }
    }

    function onTouchMove() {

        if (isRefreshing || updateInterval) {
            return;
        }

        updateInterval = setInterval(toggleRefresh, 100);
    }

    function onTouchEnd() {

        cancelLastUpdate();
        setLastUpdate();

        if (isRefreshing) {
            return;
        }

        scrollTop = params.scroller.scrollTop();

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

        get updateTimestamp() {
            return updateTimestamp;
        },

        init: function (options) {

            isRefreshing = false;

            // By default, we set the pull to refresh on the parentView
            params = {
                scroller  : Andamio.views.list.values.parentView.scroller,
                callback  : function () {},
                threshold : -50
            };

            $.extend(params, options);

            if (! params.scroller.hasClass("has-pull-to-refresh")) {

                params.scroller.addClass("has-pull-to-refresh")
                    .on("touchmove", onTouchMove)
                    .on("touchend", onTouchEnd);
                updateEl = $(".js-pull-to-refresh-timestamp");
                updateTimestamp = new Date();
                updateEl.text(Andamio.util.relativeDate(updateTimestamp));

                Andamio.dom.doc.on("Andamio:views:activateView:finish", function (event, currentView) {

                    if (currentView === "parentView") {
                        setLastUpdate(new Date());
                    }
                });
            }
        }
    };

})();
