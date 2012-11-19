/***

    Navigation module

***/

function runTest(context) {
    casper.echo("*** Checking navigation in " + context);

    // page navigation
    casper.test.assertExists(".viewport > #page-navigation");
    casper.test.assertExists("#page-navigation.page-navigation");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .navigation-header");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .action-nav-item");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .action-nav-item.navigation-item");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .action-nav-item.navigation-item.navigation-item-active");
    casper.test.assertExists(".viewport > .page-navigation-toggle");
    casper.test.assertExists(".page-navigation-toggle.action-hide-nav");

    if (context === "website") {

    } else if (context === "webapp") {

    }

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.nav.status();
    }, false, "Navigation is hidden");

    casper.test.assertNotExists(".has-navigation");

    // show navigation
    casper.evaluate(function() {
        APP.nav.show();
    });

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.nav.status();
    }, true, "Navigation is shown");

    casper.test.assertExists(".has-navigation");

    // screenshot of the page with navigation
    capture("show-nav");

    // hide the navigation
    casper.evaluate(function() {
        APP.nav.hide();
    });

    casper.test.assertNotExists(".has-navigation");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.nav.status();
    }, false, "Navigation is hidden");


    casper.echo("*** Finished navigation");
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