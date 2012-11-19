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

function checkDOM(params) {

    // either webapp or website mode
    if (params.webapp) {
        casper.echo("*** Checking DOM of webapp...");
        casper.test.assertExists(".webapp");
        casper.test.assertExists(".webapp .viewport");
    } else {
        casper.echo("*** Checking DOM of website...");
        casper.test.assertExists(".website");
        casper.test.assertExists(".website .viewport");
    }

    // page view
    casper.test.assertExists(".viewport #page-view");
    casper.test.assertExists(".viewport #page-view.page-view");

    // parent view
    if (params.parentView) {
        casper.test.assertExists(".viewport #page-view.page-view #parent-view");
        casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view");

        if (params.website) {
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
    }

    // child view
    if (params.childView) {
        casper.test.assertExists(".viewport #page-view.page-view #child-view");
        casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view");
        casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view.view-hidden");

        if (params.website) {
            casper.test.assertNotVisible(".viewport #page-view.page-view #child-view.child-view.view-hidden");
        }

        casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-header");
        casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-header .page-logo");
        casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-header .page-logo.js-title");
        casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-header .action-pop");

        casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-content");
        casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-content.js-content");
        casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view .page-content.js-content.overthrow");
    }

    // modal view
    if (params.modalView) {
        casper.test.assertExists(".viewport #modal-view");
        casper.test.assertExists(".viewport #modal-view.modal-view");
        casper.test.assertExists(".viewport #modal-view.modal-view.view-hidden");

        if (params.website) {
            casper.test.assertNotVisible(".viewport #modal-view.modal-view.view-hidden");
        }

        casper.test.assertExists(".viewport #modal-view.modal-view .page-header");
        casper.test.assertExists(".viewport #modal-view.modal-view .page-header .page-logo");
        casper.test.assertExists(".viewport #modal-view.modal-view .page-header .page-logo.js-title");
        casper.test.assertExists(".viewport #modal-view.modal-view .page-header .action-hide-modal");
        casper.test.assertExists(".viewport #modal-view.modal-view .page-content");
        casper.test.assertExists(".viewport #modal-view.modal-view .page-content.js-content");
        casper.test.assertExists(".viewport #modal-view.modal-view .page-content.js-content.overthrow");
    }

    casper.echo("*** Finished DOM");
}

/*** Run the tests, first in website, then in webapp mode ***/

casper.start(function () {
    // set iPhone dimensions
    casper.viewport(320, 480);

    // set iPhone UA
    casper.userAgent(userAgentIPhone5);
});

casper.thenOpen(localSite, function() {

    casper.echo("*** Open website");
    casper.echo(casper.getCurrentUrl());
    capture("home-website");
});

casper.then(function() {
    checkDOM({
        "website": true,
        "parentView": true,
        "childView": true,
        "pageNav": true,
        "modalView": true
    });
});

casper.thenOpen(localApp, function() {

    casper.echo("*** Open webapp");
    casper.echo(casper.getCurrentUrl());
    capture("home-webapp");
});

casper.then(function() {
    checkDOM({
        "website": false,
        "webapp": true,
        "parentView": true,
        "childView": true,
        "pageNav": true,
        "modalView": true
    });
});

/*** End test ***/

casper.run(function() {
    this.test.done();
});