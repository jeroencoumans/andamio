/***



***/

function initialState(context) {

    // test wether the pageTabs exists and contains 1 element
    casper.test.assertEvalEquals(function () {
        return Andamio.dom.pageTabs.length;
    }, 1, "Andamio.dom.pageTabs returns 1 element");

    // test number of tabs items
    casper.test.assertEvalEquals(function () {
        return Andamio.dom.pageTabsItems.length;
    }, 3, "Andamio.dom.pageTabsItems returns 3 items");

    // test active tabs item
    casper.test.assertEvalEquals(function () {
        return Andamio.dom.pageTabsActive.length;
    }, 1, "Andamio.dom.pageTabsActive returns 1 element");

    // test initial status
    casper.test.assertEvalEquals(function () {
        return Andamio.tabs.status;
    }, false, "Andamio.tabs.status returns false (tabs are hidden)");
}

function isShown(context) {

    casper.test.assertEvalEquals(function() {
        return Andamio.tabs.status;
    }, true, "Tabs are shown");

    capture(context + "-tabs-show");
}

function isHidden(context) {

    casper.test.assertEvalEquals(function() {
        return Andamio.tabs.status;
    }, false, "Tabs are hidden");

    capture(context + "-tabs-hide");
}

function show(context) {

    casper.evaluate(function() {
        Andamio.tabs.show();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        isShown(context);
    });
}

function hide(context) {

    casper.evaluate(function() {
        Andamio.tabs.hide();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        isHidden(context);
    });
}

function testActions(context) {

    casper.log("Testing actions");

    casper.click(".action-show-tabs");

    casper.wait(ANIMATION_TIMEOUT, function() {
        isShown("action");
    });

    casper.then(function () {
        casper.click(".action-hide-tabs");
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        isHidden("action");
    });
}

/***

    Start running the tests

***/

casper.start(localApp, function () {
    setupBrowser();

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
