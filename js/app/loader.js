/**
 * Controls the global loader
 * @author Jeroen Coumans
 * @class loader
 * @namespace APP
 */
APP.loader = (function () {

    // Variables
    var loaderText,
        hasLoader,
        timeoutToken;

    /**
     * Shows the loader on top of the page. When no message is given, it will use the text inside #loader .loader-text
     * @method show
     * @param {String} [msg] the message to show in the spinner
     */
    function show(msg) {

        var message = msg || loaderText.text();

        APP.dom.html.addClass("has-loader");
        hasLoader = true;

        if (APP.config.cordova) {
            if (navigator.spinner) navigator.spinner.show({"message": message});
        } else {

            if (!APP.dom.pageLoaderImg.attr("src")) {
                APP.dom.pageLoaderImg.attr("src", APP.dom.pageLoaderImg.data("img-src"));
            }

            APP.dom.pageLoader.show();
            loaderText.text(message);
        }

        APP.dom.doc.trigger("APP:loader:show");
    }

    /**
     * Hides the loader
     * @method hide
     */
    function hide() {

        APP.dom.html.removeClass("has-loader");
        hasLoader = false;

        if (APP.config.cordova) {
            if (navigator.spinner) navigator.spinner.hide();
        }
        else APP.dom.pageLoader.hide();

        APP.dom.doc.trigger("APP:loader:hide");
    }

    /**
     * Returns wether the loader is active or not
     * @method status
     */
    function status() {

        return hasLoader;
    }

    /**
     * Attach event listeners
     * @method attachListeners
     */
    function attachListeners() {

        APP.dom.doc.on("APP:views:loadPage:start", function() {

            // show loader if nothing is shown within 0,250 seconds
            timeoutToken = setTimeout(function() {
                APP.loader.show();

            }, 250);
        });

        APP.dom.doc.on("APP:views:loadPage:finish", function() {

            clearTimeout(timeoutToken);
            APP.loader.hide();
        });
    }

    /**
     * Check wether we use native or HTML spinner based on APP.config.cordova
     * @method init
     */
    function init() {

        hasLoader = APP.dom.html.hasClass("has-loader");
        loaderText = APP.dom.pageLoader.find(".loader-text");

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
