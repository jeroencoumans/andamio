/**
 * Core module for handling events and initializing capabilities
 */
APP.loader = (function () {

    // Variables
    var pageLoader,
        spinnerType,
        loaderText,
        hasLoader,
        html;

    /**
     * Shows the loader in an overlay
     */
    function show(msg) {

        var message = msg || loaderText.text();

        html.addClass("has-loader");
        hasLoader = true;

        if (spinnerType === "native") {

            navigator.spinner.show({"message": message});
        } else {

            var img = $("#loader").find("img");

            if (!img.attr("src")) {
                img.attr("src", img.data("img-src"));
            }

            pageLoader.show();
            loaderText.text(message);
        }

    }

    /**
     * Hides the loader
     */
    function hide() {

        html.removeClass("has-loader");
        hasLoader = false;

        if (spinnerType === "native") {

            navigator.spinner.hide();
        } else {

            pageLoader.hide();
        }
    }

    /**
     * Returns wether the loader is active or not
     */
    function status() {

        return hasLoader;
    }

    /**
     * Check wether we use native or HTML spinner
     */
    function init() {

        html = $("html");
        hasLoader = html.hasClass("has-loader") ? true : false;
        loaderText = $("#loader .loader-text");

        if ($.supports.cordova) {

            // only set the spinner to native when Cordova is injected
            navigator.bootstrap.addConstructor(function() {
                spinnerType = "native";
            });
        } else {

            spinnerType = "html",
            pageLoader = $("#loader"),
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