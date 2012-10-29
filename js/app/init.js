/**
 * Core module for handling events and initializing capabilities
 */
APP.core = (function () {

    // Variables
    var loader,
        html,
        pageView,
        parentView,
        childView,
        modalView,
        pageNav,
        pageNavItems,
        pageNavActive,
        pageNavUrl,
        pageTabs,
        pageTabItems,
        pageTabActive,
        pageTabUrl;
;

    function initCapabilities() {

        $.os = $.os || {};

        $.supports = $.supports || {};

        // basic ios5 detection
        $.os.ios5 = $.os.ios && $.os.version.indexOf("5.") !== -1;
        $.os.ios6 = $.os.ios && $.os.version.indexOf("6.") !== -1;

        // basic android4 detection
        $.os.android4 = $.os.android && $.os.version.indexOf("4.") !== -1;

        // Uncomment to test iOS5 mode
        // $.os.ios5 = true;

        // Uncomment to test Android 4 mode
        // $.os.android4 = true;

        $.supports.cordova = navigator.userAgent.indexOf("TMGContainer") > -1;

        $.supports.webapp = false;
        if (!$.os.android) {
            $.supports.webapp =  APP.util.getQueryParam("webapp", false) === "1" || navigator.standalone || $.supports.cordova;
        }

        // Uncomment to test standalone mode
        // $.supports.webapp = true;

        // Blackberry gives problems with fastclick (browser reports touch
        // event support on non-touch devices) so don't use it.
        // Also disable it for casper js tests.
        // Android also gives problems (tested on Galaxy S3)
        $.supports.ftfastclick = !$.os.android && !$.os.blackberry;
    }


    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** Menu button ***/
        APP.events.attachClickHandler(".action-navigation", function (event) {
            toggleNavigation();

            if (!$.supports.webapp) {
                toggleHeight();
            }
        });

        /*** Hide menu when it's open ***/
        APP.events.attachClickHandler(".action-hide-navigation", function (event) {
            hideNavigation();

            if (!$.supports.webapp) {
                toggleHeight();
            }
        });

        /*** TODO - Open page stub ***/
        APP.events.attachClickHandler(".action-push", function (event) {

            openChildPage();
        });

        /*** TODO - Go back stub ***/
        APP.events.attachClickHandler(".action-pop", function (event) {

            openParentPage();
        });

        /*** TODO - modal stub ***/
        APP.events.attachClickHandler(".action-modal", function (event) {

            openModal();
        });

        /*** TODO - modal stub ***/
        APP.events.attachClickHandler(".action-close-modal", function (event) {

            hideModal();
        });

        /*** TODO - page tab stub ***/
        APP.events.attachClickHandler(".action-page-tab", function (event) {

            var pageTabTarget = $(event.target);
            var pageTabTitle = pageTabTarget.text();

            // get URL
            pageTabUrl = pageTabTarget.data("url");

            // set active class
            pageTabActive.removeClass("tab-item-active");
            pageTabActive = pageTabTarget.addClass("tab-item-active");

            // TODO
            if (html.hasClass("has-childview")) {

                openParentPage();
            }

            loadPage(pageTabUrl, parentView);
        });

        /*** TODO - page navigation stub ***/
        APP.events.attachClickHandler(".action-nav-item", function (event) {

            var pageNavTarget = $(event.target);

            // get URL
            pageNavUrl = pageNavTarget.data("url");

            if (! pageNavUrl) {
                return;
            }

            // set active class
            pageNavActive.removeClass("navigation-item-active");
            pageNavActive = pageNavTarget.addClass("navigation-item-active");

            // TODO - remove animation
            if (html.hasClass("has-childview")) {

                openParentPage();
            }

            hideNavigation();
            loadPage(pageNavUrl, parentView)
        });
    }

    /**
     * Attach event listeners for global (application) events
     */
    function attachGlobalListeners() {

    }

    /**
     * Do an AJAX request and insert it into a view
     * - url: the URL to call
     * - view: what page to insert the content int (childView, parentView or modalView)
     */
     function loadPage(url, view) {

        $.ajax({
            url: url,
            timeout: 10000,
            headers: { "X-PJAX": true },
            beforeSend: function(xhr, settings) {

                // show loader if nothing is shown within 0,5 seconds
                setTimeout(function() {
                    if (! xhr.response) {
                        showLoader();
                    }
                }, 500);

            },
            success: function(response){

                view.find(".page-content").html(response);
            },
            error: function(xhr, type){

                console.log(xhr);
                console.log(type);
            },
            complete: function(xhr, status) {

                hideLoader();
            }
        });
     }


    /**
     * Sets height of content based on height of navigation
     */
    function toggleHeight() {

        var navigationHeight,
            viewport;

        windowHeight = $(window).height();
        navigationHeight = $("#page-navigation").height();
        if (windowHeight > navigationHeight) {
            navigationHeight = windowHeight;
            $("#page-navigation").height(navigationHeight);
        }

        viewport = $(".viewport");
        pageContent = $(".page-view");

        if (html.hasClass("has-navigation")) {
            viewport.height(navigationHeight);
            pageContent.height(navigationHeight);
        } else {
            viewport.height("");
            pageContent.height("");
        }
    }

    /**
     * Shows or hides the sections menu
     */
    function toggleNavigation() {

        html.toggleClass("has-navigation");
    }

    /**
     * Hides the sections menu
     */
    function hideNavigation() {

        html.removeClass("has-navigation");
    }

    /**
     * Opens child page
     */
    function openChildPage(url) {

        childView.find(".page-content").html("");

        if (url) {
            loadPage(url, childView);
        }

        forwardAnimation();
    }

    /**
     * Opens parent page
     */
    function openParentPage(url) {

        if (url) {
            loadPage(url, childView);
        }

        backwardAnimation();
    }

     /**
      * Forward animation
      */
    function forwardAnimation() {
        childView.removeClass("view-hidden");
        parentView.addClass("view-hidden");
        html.addClass("has-childview");
    }

     /**
      * Forward animation
      */
    function backwardAnimation() {
        childView.addClass("view-hidden");
        parentView.removeClass("view-hidden");
        html.removeClass("has-childview");
    }

    /**
     * Shows or hides the sections menu
     */
    function openModal() {

        html.addClass("has-modalview");
        pageView.addClass("view-hidden");
        modalView.removeClass("view-hidden");
    }

    /**
     * Hides the sections menu
     */
    function hideModal() {

        html.removeClass("has-modalview");
        pageView.removeClass("view-hidden");
        modalView.addClass("view-hidden");
    }

    /**
     * Shows the loader in an overlay
     */
    function showLoader() {

        html.addClass("has-loader");
        loader.show();
    }

    /**
     * Hides the loader
     */
    function hideLoader() {

        html.removeClass("has-loader");
        loader.hide();
    }


    /***
     * Initialize capabilities and attach listeners
     */
    function init() {

        loader = $("#loader");
        html = $("html");
        pageView = $("#page-view");
        parentView = $("#parent-view");
        childView = $("#child-view");
        modalView = $("#modal-view")

        pageNav = $("#page-navigation");
        pageNavItems = pageNav.find(".action-nav-item");
        pageNavActive = pageNav.find(".navigation-item-active");

        pageTabs = $("#page-tabs");
        pageTabItems = pageTabs.find(".action-page-tab");
        pageTabActive = pageTabs.find(".tab-item-active");

        initCapabilities();

        // When used as standalone app or springboard app
        if ($.supports.webapp) {
            html.removeClass("website");
            html.addClass("webapp");
        }

        if ($.os.ios) {
            html.addClass("iphone");
        }

        if ($.os.ios5) {
            html.addClass("ios5");
        }

        if ($.os.android) {
            html.addClass("android");
        }

        attachListeners();
        attachGlobalListeners();

        APP.events.init();
    }

    return {
        "init": init,
        "showLoader": showLoader,
        "hideLoader": hideLoader,
        "loadPage": loadPage,
        "openChildPage": openChildPage,
        "openParentPage": openParentPage,
        "toggleNavigation": toggleNavigation,
        "hideNavigation": hideNavigation
    };

})();
