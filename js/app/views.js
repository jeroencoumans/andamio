/**
 * Core module for handling events and initializing capabilities
 */
APP.views = (function () {

    // Variables
    var html,
        page,
        parent,
        child;

    // Export these elements for other modules
    function parentView() { return parent; }
    function childView() { return child; }
    function pageView() { return page; }

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
     * Do an AJAX request and insert it into a view
     * - url: the URL to call
     * - view: what page to insert the content int (child, parent or modal)
     */
    function loadPage(url, view) {

        // make sure to open the parent
        if (hasChildView() && view === parent) {

            backwardAnimation();
        }

        var timeoutToken = null;
        $.ajax({
            url: url,
            timeout: 10000,
            headers: { "X-PJAX": true },
            beforeSend: function(xhr, settings) {

                // show loader if nothing is shown within 0,5 seconds
                timeoutToken = setTimeout(function() {
                    APP.loader.show();

                }, 500);

            },
            success: function(response){
                var page = view.find(".js-content");

                clearTimeout(timeoutToken);

                $(page).html(response);
                $.scrollElement($(page).get(0), 0);
            },
            error: function(xhr, type){

                APP.loader.hide();
            },
            complete: function() {

                APP.loader.hide();
            }
        });
     }

    /**
     * Opens child page
     */
    function openChildPage(url, title) {

        child.find(".js-content").html("");

        if (url) {
            loadPage(url, child);
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
            loadPage(url, parent);
        }

        if (title) {
            parent.find(".js-title").text(title);
        }

        backwardAnimation();
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** Open parent page ***/
        APP.events.attachClickHandler(".action-pop", function (event) {

            var target = $(event.target).closest(".action-pop"),
                title = target.text(),
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
                title = target.text(),
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
        "pageView": pageView,
        "parentView": parentView,
        "childView": childView,
        "openChildPage": openChildPage,
        "openParentPage": openParentPage,
        "hasChildView": hasChildView,
        "loadPage": loadPage
    };

})();
