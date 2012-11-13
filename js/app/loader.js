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

        html.addClass("has-loader");

        if ($.supports.cordova && navigator.spinner) {

            navigator.spinner.show({"message": "Laden..."});
        } else {

            var img = $("#loader").find("img");

            if (!img.attr("src")) {
                img.attr("src", img.data("img-src"));
            }

            loader.show();
        }

    }

    /**
     * Hides the loader
     */
    function hide() {

        html.removeClass("has-loader");

        if ($.supports.cordova && navigator.spinner) {

            navigator.spinner.hide();
        } else {

            loader.hide();
        }
    }

    /**
     * Returns wether the loader is active or not
     */
    function status() {

        return html.hasClass("has-loader") ? true : false;
    }

    return {
        "show": show,
        "hide": hide,
        "status": status
    };

})();