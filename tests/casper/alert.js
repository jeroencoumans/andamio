/***

    Alert module

    Interfaces:
    - status
    - show(msg with plain text)
    - show(msg with HTML)
    - hide

    Actions:
    - .action-hide-alert

***/

function show(context) {

    // open an alert
    casper.evaluate(function() {
        APP.alert.show("Hello Casper!");
    });

    casper.wait(ANIMATION_TIMEOUT, function() {

        // check reported status
        casper.test.assertEvalEquals(function() {
            return APP.alert.status();
        }, true, "Alert is shown");

        casper.test.assertVisible(".viewport #page-alert");

        // test it has the correct text
        casper.test.assertSelectorHasText('.viewport #page-alert', "Hello Casper!");
    });
}

function hide(context) {

    // hide the alert
    casper.evaluate(function() {
        APP.alert.hide();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        // check reported status
        casper.test.assertEvalEquals(function() {
            return APP.alert.status();
        }, false, "Alert is hidden");

        casper.test.assertNotVisible(".viewport #page-alert");

    });
}

function showAction(context) {

    // open an alert
    casper.evaluate(function() {
        APP.alert.show('<a href="javascript:void(0)" class="action-hide-alert">Hide alert</a>');
    });

    casper.wait(ANIMATION_TIMEOUT, function() {

        // check reported status
        casper.test.assertEvalEquals(function() {
            return APP.alert.status();
        }, true, "Alert is shown");

        casper.test.assertVisible(".viewport #page-alert");

        // test it has the correct text
        casper.test.assertSelectorHasText('.viewport #page-alert', "Hide alert");
        casper.test.assertExists(".viewport #page-alert .action-hide-alert");
    });
}

function hideAction(context) {

    // hide the alert
    casper.click(".action-hide-alert");

    casper.wait(ANIMATION_TIMEOUT, function() {
        // check reported status
        casper.test.assertEvalEquals(function() {
            return APP.alert.status();
        }, false, "Alert is hidden");

        casper.test.assertNotVisible(".viewport #page-alert");
    });
}

function initialState(context) {

    casper.test.info("*** Checking alerts in " + context);

    validateContext(context);

    // check DOM
    casper.test.assertExists(".viewport > #page-alert");
    casper.test.assertExists("#page-alert.page-alert");
    casper.test.assertNotVisible("#page-alert.page-alert");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, false, "Alert is hidden");

    capture(context + "-alert-initial");
}

/***

    Start running the tests
    First we run all tests in website mode, then in webapp mode

***/

casper.start(localSite, function () {
    setupBrowser()

    casper.test.info("*** Open website");
    initialState("website");
});

casper.then(function() {

    show("website");
    capture("website-alert-show");
});

casper.then(function() {

    hide("website");
    capture("website-alert-hide");
});

casper.then(function() {

    showAction("website");
});

casper.then(function() {

    hideAction("website");
});

casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    initialState("webapp");
});

casper.then(function() {

    show("webapp");
    capture("webapp-alert-show");
});

casper.then(function() {

    hide("webapp");
    capture("webapp-alert-hide");
});

casper.then(function() {
    showAction("webapp");
});

casper.then(function() {
    hideAction("webapp");
});

/*** End test ***/

casper.run(function() {
    this.test.done();
});