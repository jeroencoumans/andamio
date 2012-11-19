/***

    Navigation module
    Split up in different functions so Casper will run them consecutively instead of simultaneously

***/

function checkDOM(context) {
    casper.test.info("*** Checking navigation in " + context);

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
};

function show(context) {
    // show navigation
    casper.test.info("*** Showing navigation...");
    casper.evaluate(function() {
        APP.nav.show();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        // check reported status
        casper.test.assertEvalEquals(function() {
            return APP.nav.status();
        }, true, "Navigation is shown");

        casper.test.assertExists(".has-navigation");

        // screenshot of the page with navigation
        capture("show-nav-" + context);
    });
};

function hide(context) {
    casper.test.info("*** Hiding navigation...");
    // hide the navigation
    casper.evaluate(function() {
        APP.nav.hide();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        casper.test.assertNotExists(".has-navigation");

        // check reported status
        casper.test.assertEvalEquals(function() {
            return APP.nav.status();
        }, false, "Navigation is hidden");
    });


    casper.test.info("*** Finished navigation");
}

/***

    Start running the tests
    First we run all tests in website mode, then in webapp mode

***/

casper.start(localSite, function () {
    setupBrowser()

    casper.test.info("*** Open website");
    checkDOM("website");
});

casper.then(function () {
    show("website");
});

casper.then(function () {
    hide("website");
});

casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    checkDOM("webapp");
});

casper.then(function () {
    show("webapp");
});

casper.then(function () {
    hide("webapp");
});


/*** End test ***/

casper.run(function() {
    this.test.done();
});