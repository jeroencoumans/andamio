/***

    DOM test checks the structure of the HTML and if all id's and classes are properly setup
    @param website
    @param webapp
    @param parentView
    @param childView
    @param pageNav
    @param modalView
    @param loader

***/

function runTest(context) {

    // either webapp or website mode
    if (context === "webapp") {
        casper.test.info("*** Checking DOM of webapp...");
        casper.test.assertExists(".webapp");
        casper.test.assertExists(".webapp .viewport");
    } else if (context === "website") {
        casper.test.info("*** Checking DOM of website...");
        casper.test.assertExists(".website");
        casper.test.assertExists(".website .viewport");
    }

    // page view
    casper.test.assertExists(".viewport #page-view");
    casper.test.assertExists(".viewport #page-view.page-view");

    // parent view
    casper.test.assertExists(".viewport #page-view.page-view #parent-view");
    casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view");

    if (context === "website") {
        casper.test.assertVisible(".viewport #page-view.page-view #parent-view.parent-view");
    }

    casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view .page-header");
    casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view .page-header .page-logo");
    casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view .page-header .page-logo.js-title");
    casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view .page-header .action-show-nav");
    casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view .page-header .action-show-modal");

    casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view .page-content");
    casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view .page-content.js-content");
    casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view .page-content.js-content.overthrow");

    // child view
    casper.test.assertExists(".viewport #page-view.page-view #child-view");
    casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view");
    casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view.view-hidden");

    if (context ==="website") {
        casper.test.assertNotVisible(".viewport #page-view.page-view #child-view.child-view.view-hidden");
    }

    casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-header");
    casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-header .page-logo");
    casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-header .page-logo.js-title");
    casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-header .action-pop");

    casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-content");
    casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-content.js-content");
    casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-content.js-content.overthrow");


    // modal view
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

    casper.test.info("*** Finished DOM");
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
