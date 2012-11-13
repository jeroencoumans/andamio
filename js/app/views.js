/**
 * Module for handling views
 */
APP.views = (function () {

    // Variables
    var html,
        page,
        parent,
        child;

    // Export these elements for other modules
    function parentView() { return parent; }
    function childView()  { return child;  }
    function pageView()   { return page;   }

    /**
     * Returns wether the childview is active or not
     */
    function hasChildView() {

        return html.hasClass("has-childview") ? true : false;
    }

     /**
      * Forward animation
      */
    function forwardAnimation() {

        child.removeClass("view-hidden").addClass("active-view");
        parent.addClass("view-hidden").removeClass("active-view");
        html.addClass("has-childview");
    }

     /**
      * Forward animation
      */
    function backwardAnimation() {

        child.addClass("view-hidden").removeClass("active-view");
        parent.removeClass("view-hidden").addClass("active-view");
        html.removeClass("has-childview");
    }


    /**
     * Opens child page
     */
    function openChildPage(url, title) {

        child.find(".js-content").html("");

        if (url) {
            APP.open.page(url, child);
        }

        if (title) {
            child.find(".js-title").text(title);
        }

        forwardAnimation();
    }

    /**
     * Opens parent page
     */
    function openParentPage(url, title) {

        if (hasChildView()) {
            backwardAnimation();
        }

        if (url) {
            APP.open.page(url, parent);
        }

        if (title) {
            parent.find(".js-title").text(title);
        }

        backwardAnimation();
    }

    function refresh() {

        // check wether to refresh child or parent page
        if (hasChildView) {

            APP.open.page(APP.open.url(), parent, refresh);
        } else {

            APP.open.page(APP.open.url(), child, refresh);
        }
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** Open parent page ***/
        APP.events.attachClickHandler(".action-pop", function (event) {

            // Stop loader if one was already being displayed
            if (APP.loader.status) {
                APP.loader.hide();
            }

            var target = $(event.target).closest(".action-pop"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            if (url) {
                openParentPage(url, title);
            } else {
                openParentPage();
            }
        });

        /*** Open child page ***/
        APP.events.attachClickHandler(".action-push", function (event) {

            var target = $(event.target).closest(".action-push"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            if (url) {
                openChildPage(url, title);
            } else {
                openChildPage();
            }
        });
    }

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        html = $("html");
        page = $("#page-view");
        parent = $("#parent-view");
        child = $("#child-view");

        attachListeners();
    }

    return {
        "init": init,
        "refresh": refresh,
        "pageView": pageView,
        "parentView": parentView,
        "childView": childView,
        "openChildPage": openChildPage,
        "openParentPage": openParentPage,
        "hasChildView": hasChildView
    };

})();
