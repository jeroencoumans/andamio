/**
 * Module for handling views
 * @author Jeroen Coumans
 * @class views
 * @namespace APP
 */
APP.views = (function () {

    // Variables
    var html,
        page,
        parent,
        child,
        hasChild;

    /**
     * @method parentView
     * @return {HTMLElement} returns the parent element
     */
    function parentView() { return parent; }

    /**
     * @method childView
     * @return {HTMLElement} returns the child element
     */
    function childView() { return child; }

    /**
     * @method pageView
     * @return {HTMLElement} returns the page element
     */
    function pageView() { return page; }

    /**
     * Returns wether the childview is active or not
     * @method hasChildPage
     * @return {Boolean} true if childPage is active, false if parentView is active
     */
    function hasChildPage() {

        return hasChild;
    }

    /**
     * Opens child page
     * @method openChildPage
     * @param {String} [url] will call APP.open.page to do an AJAX request to URL and open it in the `.js-content` of childView
     * @param {String} [title] will set the title of the childView in the `.js-title` element
     */
    function openChildPage(url, title) {

        // go forward when called from parent page
        if (! hasChild) {
            html.addClass("childview-in");
            child.removeClass("view-hidden").addClass("active-view");
            parent.addClass("view-hidden").removeClass("active-view");

            // execute after animation timeout
            APP.delay(function() {
                html.addClass("has-childview");
                html.removeClass("childview-in");
            }, 300);
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
     * Opens parent page. If a childView is active, first go back to the parentView.
     * @method openParentPage
     * @param {String} [url] will call APP.open.page to do an AJAX request to URL and open it in the `.js-content` of parentView
     * @param {String} [title] will set the title of the parentView in the `.js-title` element
     */
    function openParentPage(url, title) {

        // go back when called from child page
        if (hasChild) {
            html.addClass("childview-out");
            child.addClass("view-hidden").removeClass("active-view");
            parent.removeClass("view-hidden").addClass("active-view");

            // execute after animation timeout
            APP.delay(function() {
                html.removeClass("has-childview childview-out");
            }, 300);
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
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Open parent page
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

        // Open child page
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
     * Initialize variables and attach listeners. Sets the status of hasChildPage to true if the `html` element has the `.has-childview` class
     * @method init
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