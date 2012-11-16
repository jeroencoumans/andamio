var casper = require('casper').create();

// set UA strings
var userAgentIPhone5 = "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3 casperjs";

var localSite   = "http://localhost/andamio/kitchensink.html",
    localApp    = "http://localhost/andamio/kitchensink.html?webapp=1",
    githubSite  = "http://jeroencoumans.github.com/andamio/kitchensink.html?webapp=1",
    githubApp   = "http://jeroencoumans.github.com/andamio/kitchensink.html";

// Utility functions
function capture(filename) {
    // uncomment if you want to capture screenshots
    // return true;

    casper.capture("tests/screenshots/" + filename + '.png');
}

// Tests
function checkDOM(params) {

    // site tests
    if (params.website) {
        casper.test.assertExists(".website");
        casper.test.assertExists(".website .viewport");
    }

    // app tests
    if (params.webapp) {
        casper.test.assertExists(".webapp");
        casper.test.assertExists(".webapp .viewport");
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

    // page navigation
    if (params.pageNav) {
        casper.test.assertExists(".viewport #page-navigation");
        casper.test.assertExists(".viewport #page-navigation.page-navigation");
        casper.test.assertExists(".viewport #page-navigation.page-navigation.overthrow");
        casper.test.assertExists(".viewport #page-navigation.page-navigation.overthrow .navigation-header");
        casper.test.assertExists(".viewport #page-navigation.page-navigation.overthrow .action-nav-item");
        casper.test.assertExists(".viewport #page-navigation.page-navigation.overthrow .action-nav-item.navigation-item");
        casper.test.assertExists(".viewport #page-navigation.page-navigation.overthrow .action-nav-item.navigation-item.navigation-item-active");
        casper.test.assertExists(".viewport .page-navigation-toggle");
        casper.test.assertExists(".viewport .page-navigation-toggle.action-hide-nav");
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

    // loader
    if (params.loader) {
        casper.test.assertExists(".viewport #loader");
        casper.test.assertNotVisible(".viewport #loader");
        casper.test.assertExists(".viewport #loader.loader");
        casper.test.assertExists(".viewport #loader.loader img");
        casper.test.assertExists(".viewport #loader.loader img.spinner-dark");
    }

}

function checkAlert() {

    // check DOM
    casper.test.assertExists(".viewport #page-alert");
    casper.test.assertExists(".viewport #page-alert.page-alert");
    casper.test.assertNotVisible(".viewport #page-alert.page-alert");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, false, "Alert is hidden");

    // open an alert
    casper.evaluate(function() {
        APP.alert.show("Hello Casper!");
    });

    // test the alert is visible
    casper.test.assertVisible(".viewport #page-alert");

    // test it has the correct text
    casper.test.assertSelectorHasText('.viewport #page-alert', "Hello Casper!");

    // screenshot of the page with alert
    capture("show-alert");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, true, "Alert is shown");

    // hide the alert
    casper.evaluate(function() {
        APP.alert.hide();
    });

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, false, "Alert is hidden");
}

// Open the page
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
    casper.echo("*** Checking DOM of website");

    checkDOM({
        "website": true,
        "parentView": true,
        "childView": true,
        "pageNav": true,
        "modalView": true,
        "loader": true
    });

    casper.echo("*** Finished DOM of website");
});

casper.then(function() {

    casper.echo("*** Checking alerts...");

    checkAlert();
});

casper.thenOpen(localApp, function() {

    casper.echo("*** Open webapp");
    casper.echo(casper.getCurrentUrl());
    capture("home-webapp");
});

casper.then(function() {

    casper.echo("*** Checking DOM of webapp...");

    checkDOM({
        "website": false,
        "webapp": true,
        "parentView": true,
        "childView": true,
        "pageNav": true,
        "modalView": true,
        "loader": true
    });

    casper.echo("*** Finished DOM of webapp...");
});

// Run it
casper.run(function() {
    this.echo("We're done!").exit();
});
