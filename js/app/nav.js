/**
 * Module for page navigation
 * @author Jeroen Coumans
 * @class nav
 * @namespace APP
 */
APP.nav = (function () {

    // Variables
    var html,
        viewport,
        nav,
        toggle,
        navItems,
        activeItem,
        navheight,
        bodyheight,
        pageView,
        hasNavigation;


    /**
     * Sets height of content based on height of navigation
     * @method setPageHeight
     * @private
     * @param {Integer} height the height to which the page must be set
     */
    function setPageHeight(height) {

        // if navigation is enabled, set the page height to navigation height
        viewport.height(height);
        pageView.height(height);
    }

    /**
     * Shows the navigation
     * @method show
     */
    function show() {

        html.addClass("has-navigation");
        toggle.addClass("active");

        if (!$.supports.webapp) {
            setPageHeight(navheight);
        }

        hasNavigation = true;
    }

    /**
     * Hides the navigation
     * @method hide
     */
    function hide() {

        html.removeClass("has-navigation");
        toggle.removeClass("active");

        if (!$.supports.webapp) {
            setPageHeight("");
        }

        hasNavigation = false;
    }

    /**
     * Returns the status of the navigation
     * @method status
     * @return {Boolean} wether the navigation is shown or hidden
     */
    function status() {

        return hasNavigation;
    }

    /**
     * Returns the nav items, useful for activating a new tab
     * @method items
     * @static
     * @return {HTMLElement} the navigation items
     */
    function items() {

        return navItems;
    }

    /**
     * Returns the active item
     * @method active
     * @param {HTMLElement} [elem] sets the HTMLElement to the active navigation element
     * @return {HTMLElement} the active navigation element
     */
    function active(elem) {

        if (elem) {

            activeItem.removeClass("active");
            activeItem = elem.addClass("active");
        } else {

            return activeItem;
        }
    }


    /**
     * Attach event listeners
     * @method attachListeners
     * @private
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

            var target  = $(event.target).closest(".action-nav-item"),
                url     = APP.util.getUrl(target),
                title   = APP.util.getTitle(target);

            // If user selects the active element, or no URL is found, just close the menu
            if (target === active() || ! url) {

                hide();
                return;
            }

            active(target);
            hide();

            // set page title
            if (title) {

                APP.views.parentView().find(".js-title").text(title);
            }

            APP.open.page(url, APP.views.parentView());

        });
    }

    /***
     * Initialize capabilities and attach listeners
     * Sets the active navigation element
     * Sets the navigation status based on the `has-navigation` class on the HTML element
     * @method init
     */
    function init() {

        viewport = $(".viewport");
        pageView = $("#page-view");
        html = $("html");

        nav = $("#page-navigation");
        toggle = $(".action-show-nav");
        navItems = nav.find(".action-nav-item");
        activeItem = nav.find(".active");

        hasNavigation = html.hasClass("has-navigation") ? true : false;

        bodyheight = $(window).height();
        navheight = nav.height();

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
        "status": status,
        "items": items,
        "active": active
    };

})();