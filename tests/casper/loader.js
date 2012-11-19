/***

    Loader module

***/

function runTest(context) {
    casper.echo("*** Checking loader in " + context);

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

    // open an alert
    casper.evaluate(function() {
        APP.loader.show("Hello Casper!");
    });

    // test the alert is visible
    casper.test.assertVisible("#loader");

    // test it has the correct text
    casper.test.assertSelectorHasText('#loader .loader-text', "Hello Casper!");

    // screenshot of the page with loader
    capture("show-loader");

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

    casper.echo("*** Finished loader");
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

    casper.echo("*** Open website");
    runTest("website");
});


casper.thenOpen(localApp, function() {

    casper.echo("*** Open webapp");
    runTest("webapp");
});


/*** End test ***/

casper.run(function() {
    this.test.done();
});