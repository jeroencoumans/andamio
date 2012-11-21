/***

    Loader module

    Interfaces:
    * status
    * show(msg)
    * hide

    TODO: test native spinner

***/

function runTest(context) {
    casper.test.info("*** Checking loader in " + context);

    validateContext(context);

    // loader
    casper.test.assertExists(".viewport > #loader");
    casper.test.assertNotVisible("#loader");
    casper.test.assertExists("#loader.loader");
    casper.test.assertExists("#loader.loader img");
    casper.test.assertExists("#loader.loader img.spinner");
    casper.test.assertExists("#loader.loader .loader-text");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.loader.status();
    }, false, "Loader is hidden");

    capture(context + "-loader-initial");

    // open an alert
    casper.evaluate(function() {
        APP.loader.show("Hello Casper!");
    });

    // test the alert is visible
    casper.test.assertVisible("#loader");

    // test it has the correct text
    casper.test.assertSelectorHasText('#loader .loader-text', "Hello Casper!");

    // screenshot of the page with loader
    capture(context + "-loader-show");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.loader.status();
    }, true, "Loader is shown");

    // hide the loader
    casper.evaluate(function() {
        APP.loader.hide();
    });

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.loader.status();
    }, false, "Loader is hidden");

    capture(context + "-loader-hide");

    casper.test.info("*** Finished loader");
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