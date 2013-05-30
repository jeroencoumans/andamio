/***



***/

function initialState(context) {

    // test wether the pageAlert exists and contains 1 element
    casper.test.assertEvalEquals(function () {
        return Andamio.dom.pageAlert.length;
    }, 1, "Andamio.dom.pageAlert returns 1 element");

    casper.test.assertEvalEquals(function () {
        return typeof Andamio.dom.pageAlertText;
    }, "string", "Andamio.dom.pageAlertText returns a string");

    // test initial status
    casper.test.assertEvalEquals(function () {
        return Andamio.alert.status;
    }, false, "Andamio.alert.status returns false (alert is hidden)");
}

function isShown() {

    casper.test.assertEvalEquals(function() {
        return Andamio.alert.status;
    }, true, "Alert is shown");
}

function isHidden() {

    casper.test.assertEvalEquals(function() {
        return Andamio.alert.status;
    }, false, "Alert is hidden");
}

function show(context) {

    casper.evaluate(function() {
        Andamio.alert.show("Hello Andamio");
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        isShown();
    });

    casper.thenEvaluate(function () {
        return Andamio.dom.pageAlertText;
    }, "Hello Andamio");
}

function hide(context) {

    casper.evaluate(function() {
        Andamio.alert.hide();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        isHidden();
    });
}

function testActions(context) {

    casper.log("Testing actions");

    show(context);

    casper.then(function () {
        casper.click(".action-hide-alert");
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        isHidden();
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
