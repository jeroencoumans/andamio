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

        APP.events.init();

        // needs to come first so we're "online"
        APP.connection.init();
        APP.loader.init();
        APP.open.init();
        APP.nav.init();
        APP.modal.init();
        APP.reveal.init();
        APP.store.init(params);
        APP.tabs.init();
        APP.views.init();
        APP.alert.init();

        if ($.supports.cordova) {
            APP.phone.init();
        }
    }

    return {
        "init": init
    };

})();
