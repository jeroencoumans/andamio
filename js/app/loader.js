/**
 * Core module for handling events and initializing capabilities
 */
APP.loader = (function () {

    // Variables
    var loader = $("#loader"),
        html = $("html");

    /**
     * Shows the loader in an overlay
     */
    function show() {

        var img = $("#loader").find("img");

        if (!img.attr("src")) {
            img.attr("src", img.data("img-src"));
        }

        html.addClass("has-loader");
        loader.show();
    }

    /**
     * Hides the loader
     */
    function hide() {

        html.removeClass("has-loader");
        loader.hide();
    }

    return {
        "show": show,
        "hide": hide
    };

})();
