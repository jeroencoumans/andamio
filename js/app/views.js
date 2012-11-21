/**
 * Module for handling views
 */
APP.views = (function () {

    // Variables
    var html,
        page,
        parent,
        child,
        hasChild;

    // Export these elements for other modules
    function parentView() { return parent; }
    function childView()  { return child;  }
    function pageView()   { return page;   }

    /**
     * Returns wether the childview is active or not
     */
    function hasChildPage() {

        return hasChild;
    }

    /**
     * Opens child page
     */
    function openChildPage(url, title) {

        // go forward when called from parent page
        if (! hasChild) {
            child.removeClass("view-hidden").addClass("active-view");
            parent.addClass("view-hidden").removeClass("active-view");
            html.addClass("has-childview");
        }

        // load URL
        if (url) {

            child.find(".js-content").html("");
            APP.open.page(url, child);
        }

        // set title
        if (title) {
            child.find(".js-title").text(title);
        }

        hasChild = true;
    }

    /**
     * Opens parent page
     */
    function openParentPage(url, title) {

        // go back when called from child page
        if (hasChild) {
            child.addClass("view-hidden").removeClass("active-view");
            parent.removeClass("view-hidden").addClass("active-view");
            html.removeClass("has-childview");
        }

        // load URL
        if (url) {
            APP.open.page(url, parent);
        }

        // set title
        if (title) {
            parent.find(".js-title").text(title);
        }

        hasChild = false;
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** Open parent page ***/
        APP.events.attachClickHandler(".action-pop", function (event) {

            /*
             *  Stop loader if one was already being displayed,
             *  e.g. by going navigating while the previous AJAX call wass not finished
            */
            if (APP.loader.status()) {
                APP.loader.hide();
            }

            var target = $(event.target).closest(".action-pop"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            if (url) {

                openParentPage(url, title);
            } else {

                // update the active url manually since this action often doesn't use a URL
                APP.open.activeUrl(APP.open.parentUrl());

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
        hasChild = html.hasClass("has-childview") ? true : false;

        attachListeners();
    }

    return {
        "init": init,
        "pageView": pageView,
        "parentView": parentView,
        "childView": childView,
        "openChildPage": openChildPage,
        "openParentPage": openParentPage,
        "hasChildPage": hasChildPage
    };

})();
