/***

    Page module

***/

function runTest(context) {
    casper.test.info("*** Checking page loading...");

    casper.test.info("*** Finished page loading");
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