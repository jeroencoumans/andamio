/**
 * Module for page navigation
 * @author Jeroen Coumans
 * @class nav
 * @namespace APP
 */
APP.nav = (function () {

    // Variables
    var navheight,
        bodyheight,
        hasNavigation;

    /**
     * Sets height of content based on height of navigation
     * @method setPageHeight
     * @private
     * @param {Integer} height the height to which the page must be set
     */
    function setPageHeight(height) {

        // if navigation is enabled, set the page height to navigation height
        APP.dom.viewport.height(height);
        APP.dom.pageView.height(height);
    }

    /**
     * Shows the navigation
     * @method show
     */
    function show() {

        APP.dom.html.addClass("has-navigation");

        if (!APP.config.webapp) {
            setPageHeight(navheight);
        }

        hasNavigation = true;
    }

    /**
     * Hides the navigation
     * @method hide
     */
    function hide() {

        APP.dom.html.removeClass("has-navigation");

        if (!APP.config.webapp) {
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
     * Returns the active item
     * @method active
     * @param {HTMLElement} [elem] sets the HTMLElement to the active navigation element
     * @return {HTMLElement} the active navigation element
     */
    function setActive(elem) {

        if (elem) {

            APP.dom.pageNavActive.removeClass("active");
            APP.dom.pageNavActive = elem.addClass("active");
        } else {

            return APP.dom.pageNavActive;
        }
    }


    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Menu button
        APP.events.attachClickHandler(".action-show-nav", function () {

            show();
        });

        // Hide menu when it's open
        APP.events.attachClickHandler(".action-hide-nav", function () {

            hide();
        });

        // page navigation
        APP.events.attachClickHandler(".action-nav-item", function (event) {

            var target  = $(event.target).closest(".action-nav-item"),
                url     = APP.util.getUrl(target),
                title   = APP.util.getTitle(target);

            // If user selects the active element, or no URL is found, just close the menu
            if (target === APP.nav.pageNavActive || ! url) {

                hide();
                return;
            }

            setActive(target);
            hide();

            // set page title
            if (title) {

                APP.dom.parentViewTitle.text(title);
            }

            APP.open.page(url, APP.dom.parentView);

        });
    }

    /**
     * Initialize capabilities and attach listeners
     * - Sets the active navigation element
     * - Sets the navigation status based on the `has-navigation` class on the HTML element
     * @method init
     */
    function init() {

        hasNavigation = APP.dom.html.hasClass("has-navigation") ? true : false;

        bodyheight = $(window).height();
        navheight = APP.dom.pageNav.height();

        // make sure the navigation is as high as the page
        if (bodyheight > navheight) {
            navheight = bodyheight;
            APP.dom.pageNav.height(navheight);
        }

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status,
        "setActive": setActive
    };

})();
