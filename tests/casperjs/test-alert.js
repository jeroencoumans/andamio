/***

    Alert module

    Interfaces:
    - status
    - show(msg with plain text)
    - show(msg with HTML)
    - hide

    Actions:
    - .action-hide-alert

***/

var alertSelector = ".js-page-alert",
    alertTextSelector = ".js-page-alert .js-page-alert-text";

function validateElements(context) {

    casper.test.assertExists(alertSelector);
    casper.test.assertExists(alertTextSelector);

    casper.test.assertEvalEquals(function() {
        return Andamio.dom.pageAlert.length;
    }, 1, "Andamio.dom.pageAlert contains 1 element");

    casper.test.assertEvalEquals(function() {
        Andamio.dom.pageAlertText = "Hello Casper!";
        return Andamio.dom.pageAlertText;
    }, "Hello Casper!", "Setter for pageAlertText works");
}

function show(context) {

    // open an alert
    casper.evaluate(function() {
        Andamio.alert.show("Testing 123");
    });

    casper.wait(ANIMATION_TIMEOUT, function() {

        // check reported status
        casper.test.assertEvalEquals(function() {
            return Andamio.alert.status;
        }, true, "Alert is shown");

        casper.test.assertVisible(alertSelector);

        // test it has the correct text
        casper.test.assertSelectorHasText(alertTextSelector, "Testing 123");
    });
}

function hide(context) {

    // hide the alert
    casper.evaluate(function() {
        Andamio.alert.hide();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        // check reported status
        casper.test.assertEvalEquals(function() {
            return Andamio.alert.status;
        }, false, "Alert is hidden");

        casper.test.assertNotVisible(alertSelector);

    });
}

/***

    Start running the tests
    First we run all tests in website mode, then in webapp mode

***/

casper.start(localSite, function () {
    setupBrowser()

    casper.test.info("*** Open website");
    validateElements("website");
});

casper.then(function() {

    show("website");
    capture("website-alert-show");
});

casper.then(function() {

    hide("website");
    capture("website-alert-hide");
});

casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    validateElements("website");
});

casper.then(function() {

    show("webapp");
    capture("webapp-alert-show");
});

casper.then(function() {

    hide("webapp");
    capture("webapp-alert-hide");
});

/*** End test ***/

casper.run(function() {
    this.test.done();
});
