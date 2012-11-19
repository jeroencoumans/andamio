/***

    Modal module

***/

function checkDOM(context) {

    casper.test.info("*** Checking DOM of " + context);

    casper.test.assertExists(".viewport #modal-view");
    casper.test.assertExists(".viewport #modal-view.modal-view");
    casper.test.assertExists(".viewport #modal-view.modal-view.view-hidden");

    if (context ==="website") {
        casper.test.assertNotVisible(".viewport #modal-view.modal-view.view-hidden");
    }

    casper.test.assertExists(".viewport #modal-view.modal-view .page-header");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-header .page-logo");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-header .page-logo.js-title");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-header .action-hide-modal");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-content");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-content.js-content");
    casper.test.assertExists(".viewport #modal-view.modal-view .page-content.js-content.overthrow");

    // this gets hidden when modal is open, so check for its presence
    casper.test.assertExists(".viewport #page-view.page-view");
    casper.test.assertNotExists(".viewport #page-view.page-view.view-hidden");

    // Test position of modal
    var elementBounds = casper.getElementBounds("#modal-view");

    casper.echo("height: " + elementBounds.height);
    casper.echo("top: " + elementBounds.top);

    if (context === "website") {

        casper.test.assert(elementBounds.height === 0);

    } else if (context === "webapp") {

        casper.test.assert(elementBounds.height === elementBounds.top);
    }

    casper.test.info("*** Finished DOM");
}

function show(context) {
    // show navigation
    casper.test.info("*** Showing modal...");
    casper.evaluate(function() {
        APP.modal.show();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        // check reported status
        casper.test.assertEvalEquals(function() {
            return APP.modal.status();
        }, true, "Navigation is shown");

        casper.test.assertExists(".has-modalview");
        casper.test.assertExists(".has-modalview #modal-view.modal-view");
        casper.test.assertExists(".viewport #page-view.page-view.view-hidden");
        casper.test.assertNotExists(".viewport #modal-view.modal-view.view-hidden");

        // screenshot of the page with navigation
        capture("show-modal-" + context);
    });
};

function hide(context) {
    casper.test.info("*** Hiding modal...");
    // hide the navigation
    casper.evaluate(function() {
        APP.modal.hide();
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        casper.test.assertNotExists(".has-modalview");

        // check reported status
        casper.test.assertEvalEquals(function() {
            return APP.modal.status();
        }, false, "Modal is hidden");
    });


    casper.test.info("*** Finished modal");
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