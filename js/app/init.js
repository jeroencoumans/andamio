/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

/**
 * Core module for initializing capabilities and modules
 * @author Jeroen Coumans
 * @class init
 * @namespace APP
 */
Andamio.init = function (options) {

    // Apply user parameters
    Andamio.config.init(options);

    // Initialize the rest
    Andamio.alert.init();
    Andamio.cache.init();
    Andamio.connection.init();
    Andamio.loader.init();

    Andamio.views.init();
    Andamio.nav.init();
    Andamio.reveal.init();

    if (Andamio.config.webapp) {
        Andamio.tabs.init();
    }

    if (Andamio.config.cordova) {
        Andamio.phone.init();
    }
};
