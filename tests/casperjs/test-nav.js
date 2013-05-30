/***



***/

function initialState(context) {

    // test wether the pageNav exists and contains 1 element
    casper.test.assertEvalEquals(function () {
        return Andamio.dom.pageNav.length;
    }, 1, "Andamio.dom.pageNav returns 1 element");

    // test number of navigation items
    casper.test.assertEvalEquals(function () {
        return Andamio.dom.pageNavItems.length;
    }, 5, "Andamio.dom.pageNavItems returns 5 items");

    // test active navigation item
    casper.test.assertEvalEquals(function () {
        return Andamio.dom.pageNavActive.length;
    }, 1, "Andamio.dom.pageNavActive returns 1 element");

    // test initial status
    casper.test.assertEvalEquals(function () {
        return Andamio.nav.status;
    }, false, "Andamio.nav.status returns false (navigation is hidden)");
}

function isShown(context) {

    casper.test.assertEvalEquals(function() {
        return Andamio.nav.status;
    }, true, "Navigation is shown");

    capture(context + "-navigation-show");
}

function isHidden(context) {

    casper.test.assertEvalEquals(function() {
        return Andamio.nav.status;
    }, false, "Navigation is hidden");

    capture(context + "-navigation-hide");
}

function show(context) {

    casper.evaluate(function() {
        Andamio.nav.show();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        isShown(context);
    });
}

function hide(context) {

    casper.evaluate(function() {
        Andamio.nav.hide();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        isHidden(context);
    });
}

function testActions(context) {

    casper.log("Testing actions");

    casper.click(".action-show-nav");

    casper.wait(ANIMATION_TIMEOUT, function() {
        isShown("action");
    });

    casper.then(function () {
        casper.click(".action-hide-nav");
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        isHidden("action");
    });
}

/***

    Start running the tests

***/

casper.start(localSite, function () {
    setupBrowser();

    casper.test.info("*** Open website");
    initialState("website");
});

casper.then(function() {

    show("website");
});

casper.then(function() {

    hide("website");
});

casper.then(function() {

    testActions("website");
});

casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    initialState("webapp");
});

casper.then(function() {

    show("webapp");
});

casper.then(function() {

    hide("webapp");
});

casper.then(function() {

    testActions("webapp");
});


/*** End test ***/

casper.run(function() {
    this.test.done();
});
