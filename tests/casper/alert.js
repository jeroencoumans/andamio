/***

    Alert module

***/

function runTest(context) {

    casper.test.info("*** Checking alerts in " + context);

    // check DOM
    casper.test.assertExists(".viewport > #page-alert");
    casper.test.assertExists("#page-alert.page-alert");
    casper.test.assertNotVisible("#page-alert.page-alert");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, false, "Alert is hidden");

    // open an alert
    casper.evaluate(function() {
        APP.alert.show("Hello Casper!");
    });

    // test the alert is visible
    casper.test.assertVisible(".viewport #page-alert");

    // test it has the correct text
    casper.test.assertSelectorHasText('.viewport #page-alert', "Hello Casper!");

    // screenshot of the page with alert
    capture("show-alert-" + context);

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, true, "Alert is shown");

    // hide the alert
    casper.evaluate(function() {
        APP.alert.hide();
    });

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, false, "Alert is hidden");

    casper.test.info("*** Finished alerts");
}

/***

    Start running the tests
    First we run all tests in website mode, then in webapp mode

***/

casper.start(function () {
    // set iPhone dimensions
    casper.viewport(320, 480);

    // set iPhone UA
    casper.userAgent(userAgentIPhone5);
});

casper.thenOpen(localSite, function() {

    casper.test.info("*** Open website");
    runTest("website");
});


casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    runTest("webapp");
});


/*** End test ***/

casper.run(function() {
    this.test.done();
});