/***

    Navigation module
    Split up in different functions so Casper will run them consecutively instead of simultaneously

    Interfaces:
    - status
    - show
    - hide
    - items
    - active [TODO]

    Actions:
    - .action-show-nav
    - .action-hide-nav
    - .action-nav-item

***/

function initialState(context) {
    casper.test.info("*** Checking navigation in " + context);

    // page navigation
    casper.test.assertExists(".viewport > #page-navigation");
    casper.test.assertExists(".viewport > #page-view"); // this element gets positioned to the right, so test for its existence
    casper.test.assertExists("#page-navigation.page-navigation");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .navigation-header");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .action-nav-item");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .action-nav-item.navigation-item");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .action-nav-item.navigation-item.active");
    casper.test.assertExists(".viewport > .page-navigation-toggle");
    casper.test.assertExists(".page-navigation-toggle.action-hide-nav");

    // check wether items returns the correct amount of items
    // TODO - find a better way to test wether this actually returns the navigation item DOM elements...
    var navItemsLength = casper.evaluate(function() {
        return APP.nav.items().length;
    });

    var foundNavItems = casper.evaluate(function() {
        return __utils__.findAll(".action-nav-item").length;
    })

    casper.test.assert(navItemsLength === foundNavItems, "Length of APP.nav.items() is " + foundNavItems);

    // check navigation height
    var navPos = casper.getElementBounds("#page-navigation");
    var docHeight = casper.evaluate(function() {
        return __utils__.getDocumentHeight();
    });

    if (context === "website") {
        casper.test.assert(navPos.height <= docHeight, "Navigation height (" + navPos.height + ") is equal or smaller then document height (" + docHeight + ")");
    } else if (context === "webapp") {
        casper.test.assert(navPos.height === docHeight, "Navigation height (" + navPos.height + ") is equal to document height (" + docHeight + ")");
    }

    checkHidden();
}

function checkHidden(context) {
    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.nav.status();
    }, false, "Navigation is hidden");

    casper.test.assertNotExists(".has-navigation");

    // Test position of navigation
    var navPos = casper.getElementBounds("#page-navigation");
    var pagePos = casper.getElementBounds("#page-view");

    casper.test.assert(navPos.left === -(navPos.width), "Navigation is positioned to the left equal to its width");
    casper.test.assert(pagePos.left === 0, "Page is positioned to the left");
}

function checkShown(context) {
    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.nav.status();
    }, true, "Navigation is shown");

    casper.test.assertExists(".has-navigation");

    var navPos = casper.getElementBounds("#page-navigation");
    var pagePos = casper.getElementBounds("#page-view");
    var togglePos = casper.getElementBounds(".page-navigation-toggle.action-hide-nav");

    // Test position of navigation
    casper.test.assert(navPos.left === 0, "Navigation is positioned to the left");
    casper.test.assert(pagePos.left === navPos.width, "Pageview is positioned left (" + pagePos.left + ") equal to the width of the navigation (" + navPos.width + ")");

    // check navigation height is equal to page height
    casper.test.assert(navPos.height === pagePos.height, "Navigation height (" + navPos.height + ") is equal to page height (" + pagePos.height + ")");

    // check position of toggle
    casper.test.assert(togglePos.left === navPos.width, "Toggle is positioned left (" + togglePos.left + ") equal to the width of the navigation (" + navPos.width + ")");
    casper.test.assert(togglePos.height === pagePos.height, "Toggle height (" + togglePos.height + ") is equal to page height (" + pagePos.height + ")");
}

function show(context) {
    // show navigation
    casper.test.info("*** Showing navigation...");
    casper.evaluate(function() {
        APP.nav.show();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        checkShown();

        // screenshot of the page with navigation
        capture("show-nav-" + context);
    });
}

function hide(context) {
    casper.test.info("*** Hiding navigation...");
    // hide the navigation
    casper.evaluate(function() {
        APP.nav.hide();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        checkHidden();
    });
}

function actionShow(context) {
    casper.test.info("*** Clicking on action-show-nav...");
    casper.click(".action-show-nav");

    casper.wait(ANIMATION_TIMEOUT, function() {
        checkShown();
    });
}

function actionHide(context) {
    casper.test.info("*** Clicking on action-hide-nav...");
    casper.click(".action-hide-nav");

    casper.wait(ANIMATION_TIMEOUT, function() {
        checkHidden();

        capture("action-hide-" + context);
    });
}

function actionItem(context) {
    casper.test.info("*** Clicking on a menu item...");
    casper.click("#casper-click-nav.action-nav-item");

    casper.waitForSelector("#box-1", function() {
        casper.echo("Loading of external URL via action-nav-item works", "INFO");

        // check wether the clicked item is now also the active item
        casper.test.assertExists("#casper-click-nav.active");

        var navText = casper.fetchText("#casper-click-nav.active");
        var titleText = casper.fetchText("#parent-view .js-title");
        casper.test.assertEquals(navText, titleText, "The parent title is equal to the active navigation item text");

        checkHidden();

        // screenshot of the page with navigation
        capture("action-nav-" + context);
    });
}

/***

    Start running the tests
    First we run all tests in website mode, then in webapp mode

***/

casper.start(localSite, function () {
    setupBrowser();

    casper.test.info("*** Open website");
    initialState("website");
});

// test interfaces
casper.then(function () {
    show("website");
});

casper.then(function () {
    hide("website");
});

// test actions
casper.then(function () {
    actionShow("website");
});

casper.then(function () {
    actionHide("website");
});

// test navigation links
casper.then(function () {
    show("website");
});

casper.then(function () {
    actionItem("website");

    casper.test.info("*** Finished navigation");
});

/***

    Start webapp test

***/
casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    initialState("webapp");
});

// test interfaces
casper.then(function () {
    show("webapp");
});

casper.then(function () {
    hide("webapp");
});

// test actions
casper.then(function () {
    actionShow("webapp");
});

casper.then(function () {
    actionHide("webapp");
});

// test navigation links
casper.then(function () {
    actionItem("webapp");

    casper.test.info("*** Finished navigation");
});

/*** End test ***/

casper.run(function() {
    this.test.done();
});