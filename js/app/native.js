/**
 * Module that encapsulates all behaviour for browsing with pjax.
 */
APP.phone = (function () {

    /**
     * Intercepts all clicks on anchor tags
     */
    function interceptAnchorClicks() {

        $(document.body).on("click", "a", function(event) {
            if ($.supports.cordova && APP.util.isExternalLink(this)) {

                // open external URL's in in-app Cordova browser
                var href = $(this).attr("href");
                navigator.utility.openUrl(href, "browser");
                return false;
            } else {
                return true;
            }
        });
    }

    /**
     * Attach Cordova listeners
     */
    function attachListeners() {

        // scroll to top on tapbar tap
        document.addEventListener("statusbartap", function() {

            var pageScroller = $(".active-view .overthrow");
            $.scrollElement(pageScroller.get(0), 0);

        });
    }

    function init() {

        interceptAnchorClicks();
        attachListeners();
    }

    return {
        "init": init,
        "navigateTo": navigateTo,
        "refreshCurrentPage": refreshCurrentPage
    };
})();