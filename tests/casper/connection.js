/***

    Connection module

    Interfaces:
    - status
    - status(offline)
    - status(online)

***/

function runTest(context) {
    casper.test.info("*** Checking connection in " + context);

    validateContext(context);

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.connection.status();
    }, "online", "The connection is online");

    capture(context + "-connection-initial");

    // set connection to offline
    casper.evaluate(function() {
        APP.connection.status("offline");
    });

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

    // screenshot of the page with connection alert
    capture(context + "-connection-offline");

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

    // screenshot of the page with connection alert
    capture(context + "-connection-online");

    casper.test.info("*** Finished connection");
}

/***

    Start running the tests
    First we run all tests in website mode, then in webapp mode

***/

casper.start(localSite, function () {
    setupBrowser()

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