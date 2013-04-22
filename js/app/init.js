/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

Andamio.init = function (options) {

    // Apply user parameters
    Andamio.config.init(options);

    // Show UI as soon as possible
    if (Andamio.config.tmgcontainer) {
        Andamio.tmgcontainer.init();
    }

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
};
