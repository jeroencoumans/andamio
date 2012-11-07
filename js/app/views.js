/**
 * Core module for handling events and initializing capabilities
 */
APP.views = (function () {

    // Variables
    var html,
        parentView,
        childView;

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** TODO - Open page stub ***/
        APP.events.attachClickHandler(".action-push", function (event) {

            var target = $(event.target).closest(".action-push");
            var title = target.text();
            var url = APP.util.getUrl(target);

            if (url) {
                openChildPage(url, title);
            }
        });

        /*** TODO - Go back stub ***/
        APP.events.attachClickHandler(".action-pop", function (event) {

            openParentPage();
        });
    }

    /**
     * Do an AJAX request and insert it into a view
     * - url: the URL to call
     * - view: what page to insert the content int (childView, parentView or modalView)
     */
     function loadPage(url, view) {

        // make sure to open the parent
        if (html.hasClass("has-childview") && view === parentView) {

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
                var page = view.find(".page-content");

                clearTimeout(timeoutToken);

                $(page).html(response);
                $.scrollElement($(page).get(0), 0);
            },
            error: function(xhr, type){

                console.log(xhr);
                console.log(type);
            },
            complete: function(xhr, status) {

                APP.loader.hide();
            }
        });
     }

    /**
     * Opens child page
     */
    function openChildPage(url, title) {

        childView.find(".page-content").html("");

        if (url) {
            loadPage(url, childView);
        }

        if (title) {
            childView.find(".page-logo").text(title);
        }

        forwardAnimation();
    }

    /**
     * Opens parent page
     */
    function openParentPage(url, title) {

        if (html.hasClass("has-childview")) {

            backwardAnimation();
        }

        if (url) {
            loadPage(url, parentView);
        }

        if (title) {
            parentView.find(".page-logo").text(title);
        }

        backwardAnimation();
    }

     /**
      * Forward animation
      */
    function forwardAnimation() {

        childView.removeClass("view-hidden").addClass("active-view");
        parentView.addClass("view-hidden").removeClass("active-view");
        html.addClass("has-childview");
    }

     /**
      * Forward animation
      */
    function backwardAnimation() {

        childView.addClass("view-hidden").removeClass("active-view");
        parentView.removeClass("view-hidden").addClass("active-view");
        html.removeClass("has-childview");
    }

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        html = $("html");
        parentView = $("#parent-view");
        childView = $("#child-view");

        attachListeners();
    }

    return {
        "init": init,
        "openChildPage": openChildPage,
        "openParentPage": openParentPage,
        "loadPage": loadPage
    };

})();
