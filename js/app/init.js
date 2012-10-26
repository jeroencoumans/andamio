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
            childView.removeClass("view-hidden");
            parentView.addClass("view-hidden");
            html.addClass("has-childview");
        });

        /*** TODO - Go back stub ***/
        APP.events.attachClickHandler(".action-pop", function (event) {
            childView.addClass("view-hidden");
            parentView.removeClass("view-hidden");
            html.removeClass("has-childview");
        });

        /*** TODO - modal stub ***/
        APP.events.attachClickHandler(".action-modal", function (event) {

            toggleModal();
        });

        /*** TODO - modal stub ***/
        APP.events.attachClickHandler(".action-close-modal", function (event) {

            hideModal();
        });

        /*** TODO - page tab stub ***/
        APP.events.attachClickHandler(".action-page-tab", function (event) {

            if (html.hasClass("has-childview")) {
                childView.addClass("view-hidden");
                parentView.removeClass("view-hidden");
                html.removeClass("has-childview");
            }

            var pageTabTarget = $(event.target);

            // set active class
            pageTabActive.removeClass("tab-item-active");
            pageTabActive = pageTabTarget.addClass("tab-item-active");

            // get URL
            pageTabUrl = pageTabTarget.data("url");

            showLoader();

            $.get(pageTabUrl, function(response) {
                $("#parent-view .page-content").html(response);
                hideLoader();
            });
        });

    }

    /**
     * Attach event listeners for global (application) events
     */
    function attachGlobalListeners() {

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
     * Shows or hides the sections menu
     */
    function toggleModal() {

        html.toggleClass("has-modalview");
        pageView.toggleClass("view-hidden");
        modalView.toggleClass("view-hidden");
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
        "hideNavigation": hideNavigation
    };

})();
