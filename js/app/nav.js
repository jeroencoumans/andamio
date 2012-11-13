/**
 * Module for page navigation
 */
APP.nav = (function () {

    // Variables
    var html,
        body,
        nav,
        toggle,
        items,
        active,
        navheight,
        bodyheight,
        pageView;


    /**
     * Sets height of content based on height of navigation
     */
    function setPageHeight(height) {

        // if navigation is enabled, set the page height to navigation height
        body.height(height);
        pageView.height(height);
    }

    /**
     * Shows the navigation
     */
    function show() {

        html.addClass("has-navigation");
        toggle.addClass("active");

        if (!$.supports.webapp) {
            setPageHeight(navheight);
        }
    }

    /**
     * Hides the navigation
     */
    function hide() {

        html.removeClass("has-navigation");
        toggle.removeClass("active");

        if (!$.supports.webapp) {
            setPageHeight("");
        }
    }

    /**
     * Returns the status of the navigation
     */
    function status() {

        return html.hasClass("has-navigation") ? true : false;
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** Menu button ***/
        APP.events.attachClickHandler(".action-show-nav", function () {

            show();
        });

        /*** Hide menu when it's open ***/
        APP.events.attachClickHandler(".action-hide-nav", function () {

            hide();
        });

        /*** TODO - page navigation stub ***/
        APP.events.attachClickHandler(".action-nav-item", function (event) {

            var target = $(event.target).closest(".action-nav-item"),
                url = APP.util.getUrl(target),
                title = target.text();

            if (target.hasClass("navigation-item-active")) {

                hide();
                return true;
            }

            if (url) {

                // set active class
                active.removeClass("navigation-item-active");
                active = target.addClass("navigation-item-active");

                hide();

                // set page title
                APP.views.parentView().find(".js-title").text(title);
                APP.open.page(url, APP.views.parentView());
            }
        });
    }

    /***
     * Initialize capabilities and attach listeners
     */
    function init() {

        bodyheight = $(window).height();
        navheight = $("#page-navigation").height();

        body = $("body");
        pageView = $("#page-view");
        html = $("html");

        nav = $("#page-navigation");
        toggle = $(".action-show-nav");
        items = nav.find(".action-nav-item");
        active = nav.find(".navigation-item-active");

        // make sure the navigation is as high as the page
        if (bodyheight > navheight) {
            navheight = bodyheight;
            nav.height(navheight);
        }

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
