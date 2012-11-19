/***

    Connection module

***/

function runTest(context) {
    casper.test.info("*** Checking connection in " + context);

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.connection.status();
    }, "online", "The connection is online");

    // set connection to offline
    casper.evaluate(function() {
        APP.connection.status("offline");
    });

    // screenshot of the page with connection alert
    capture("connection-offline-" + context);

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.connection.status();
    }, "offline", "The connection is offline");

    // test the alert is visible
    casper.test.assertVisible(".viewport #page-alert");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, true, "The connection alert is shown");

    // set connection to online again
    casper.evaluate(function() {
        APP.connection.status("online");
    });

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.connection.status();
    }, "online", "The connection is online");

    // test the alert is hidden
    casper.test.assertNotVisible(".viewport #page-alert");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, false, "The connection alert is hidden");

    casper.test.info("*** Finished connection");
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