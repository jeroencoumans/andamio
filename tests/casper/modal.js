/***

    Modal module

    interfaces:
        - show
        - hide
        - status

    event listeners:
        - .action-show-modal
        - .action-hide-modal

***/

function initialState(context) {

    casper.test.info("*** Checking DOM of " + context);

    validateContext(context);

    casper.test.assertExists(".viewport #modal-view");
    casper.test.assertExists(".viewport #modal-view.modal-view");
    casper.test.assertExists(".viewport #modal-view.modal-view.view-hidden");

    if (context ==="website") {
        casper.test.assertNotVisible(".viewport #modal-view.modal-view.view-hidden");
    }

    casper.test.assertExists(".action-show-modal");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-header");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-header .page-logo");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-header .page-logo.js-title");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-header .action-hide-modal");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-content");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-content.js-content");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-content.js-content.overthrow");

    //
    casper.test.assertSelectorHasText(".viewport #modal-view.modal-view .page-header .page-logo.js-title", "Default modal title");

    checkHidden();
    capture(context + "-modal-initial");

    casper.test.info("*** Finished DOM");
}

function checkShown(context) {
    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.modal.status();
    }, true, "Modal is shown");

    casper.test.assertExists(".has-modalview");
    casper.test.assertExists(".has-modalview #modal-view.modal-view");
    casper.test.assertExists(".viewport #page-view.page-view.view-hidden");
    casper.test.assertNotExists(".viewport #modal-view.modal-view.view-hidden");

    // Test position of modal
    var elementBounds = casper.getElementBounds("#modal-view");

    if (context === "website") {

        casper.test.assert(elementBounds.height !== 0);

    } else if (context === "webapp") {

        casper.test.assert(elementBounds.top === 0);
    }
}

function checkHidden(context) {
    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.modal.status();
    }, false, "Modal is hidden");

    // This gets hidden when modal is open, so check for its presence
    casper.test.assertExists(".viewport #page-view.page-view");
    casper.test.assertNotExists(".viewport #page-view.page-view.view-hidden");
    casper.test.assertNotExists(".has-modalview");

    // Test position of modal
    var elementBounds = casper.getElementBounds("#modal-view");

    casper.echo("height: " + elementBounds.height);
    casper.echo("top: " + elementBounds.top);

    if (context === "website") {

        casper.test.assert(elementBounds.height === 0);

    } else if (context === "webapp") {

        casper.test.assert(elementBounds.height === elementBounds.top);
    }
}

function show(context, url, title) {
    // show navigation
    casper.test.info("*** Showing modal...");
    casper.evaluate(function() {
        APP.modal.show();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {

        checkShown(context);
        capture(context + "-modal-show");
    });
};

function hide(context) {
    casper.test.info("*** Hiding modal...");
    // hide the navigation
    casper.evaluate(function() {
        APP.modal.hide();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {

        checkHidden(context);
        capture(context + "-modal-hide");
    });

    casper.test.info("*** Finished modal");
}

function actionShow(context) {
    casper.test.info("*** Clicking on action-show-modal...");
    casper.click(".action-show-modal");

    casper.wait(ANIMATION_TIMEOUT, function() {
        checkShown();

        // also check title
        casper.test.assertSelectorHasText(".viewport #modal-view.modal-view .page-header .page-logo.js-title", "Actual modal title");
        capture(context + "-modal-action-show");
    });
}

function actionHide(context) {
    casper.test.info("*** Clicking on action-hide-modal...");
    casper.click(".action-hide-modal");

    casper.wait(ANIMATION_TIMEOUT, function() {
        checkHidden();
        capture(context + "-modal-action-hide");
    });
}

/***

    Start running the tests
    First we run all tests in website mode, then in webapp mode

***/

casper.start(localSite, function () {
    setupBrowser()

    casper.test.info("*** Open website");
    initialState("website");
});

casper.then(function () {
    show("website");
});

casper.then(function () {
    hide("website");
});

casper.then(function () {
    actionShow("website");
});

casper.then(function () {
    actionHide("website");
});

casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    initialState("webapp");
});

casper.then(function () {
    show("webapp");
});

casper.then(function () {
    hide("webapp");
});

casper.then(function () {
    actionShow("webapp");
});

casper.then(function () {
    actionHide("webapp");
});


/*** End test ***/

casper.run(function() {
    this.test.done();
});