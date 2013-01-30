/*jshint latedef:true, undef:true, unused:true boss:true */
/*global APP */

/**
 * Core module for initializing capabilities and modules
 * @author Jeroen Coumans
 * @class core
 * @namespace APP
 */
APP.core = (function () {

    /**
     * Initialize variables and attach listeners
     * @method init
     */
    function init(params) {

        // Apply user parameters
        APP.config.init(params);

        // Initialize events
        APP.events.init();
        if (APP.config.cordova) APP.phone.init();

        // Go online
        APP.connection.init();

        // Initialize views
        APP.views.init();

        // Initialize the rest
        APP.alert.init();
        APP.loader.init();
        APP.nav.init();
        APP.reveal.init();
        APP.tabs.init();
    }

    return {
        "init": init
    };

})();
