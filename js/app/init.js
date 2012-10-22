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
        modalView;

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

        $.supports.webapp = false;
        if (!$.os.android) {
            $.supports.webapp =  APP.util.getQueryParam("webapp", false) === "1" || navigator.standalone;
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

        APP.events.attachClickHandler(".action-navigation", function (event) {
            toggleNavigation();
        });

        APP.events.attachClickHandler(".action-hide-navigation", function (event) {
            hideNavigation();
        });

        APP.events.attachClickHandler(".action-push", function (event) {
            childView.removeClass("view-hidden");
            parentView.addClass("view-hidden");
            html.addClass("has-childview");
        });

        APP.events.attachClickHandler(".action-pop", function (event) {
            childView.addClass("view-hidden");
            parentView.removeClass("view-hidden");
            html.removeClass("has-childview");
        });

        APP.events.attachClickHandler(".action-modal", function (event) {

            toggleModal();
        });

    }

    /**
     * Attach event listeners for global (application) events
     */
    function attachGlobalListeners() {

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

        var img = loader.find("img");
        if (!img.attr("src")) {
            img.attr("src", img.attr("data-img-src"));
        }

        loader.show();
    }

    /**
     * Hides the loader
     */
    function hideLoader() {

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
