/**
 * Core module for handling events and initializing capabilities
 */
APP.loader = (function () {

    // Variables
    var loader,
        spinner,
        html;

    /**
     * Shows the loader in an overlay
     */
    function show() {

        html.addClass("has-loader");

        if (spinner === "native") {

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

        if (spinner === "native") {

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

    /**
     * Check wether we use native or HTML spinner
     */
    function init() {

        html = $("html");

        if ($.supports.cordova) {

            // only set the spinner to native when Cordova is injected
            navigator.bootstrap.addConstructor(function() {
                spinner = "native";
            });
        } else {

            spinner = "html",
            loader = $("#loader"),
            html = $("html");
        }
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();