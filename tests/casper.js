/***

    TODO - split up in module-specific tests

***/

/*** Start casper ***/

var casper = require('casper').create();

/***

    Global variables

***/

var userAgentIPhone5 = "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3 casperjs";

var localSite   = "http://localhost/andamio/kitchensink.html",
    localApp    = "http://localhost/andamio/kitchensink.html?webapp=1",
    githubSite  = "http://jeroencoumans.github.com/andamio/kitchensink.html?webapp=1",
    githubApp   = "http://jeroencoumans.github.com/andamio/kitchensink.html";


/***

    Utility functions

***/

function capture(filename) {
    // uncomment if you want to capture screenshots
    // return true;

    casper.capture("tests/screenshots/" + filename + '.png');
}

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

/***

    Alert module

***/

function checkAlert(context) {

    casper.echo("*** Checking alerts in " + context);

    // check DOM
    casper.test.assertExists(".viewport > #page-alert");
    casper.test.assertExists("#page-alert.page-alert");
    casper.test.assertNotVisible("#page-alert.page-alert");

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

    casper.echo("*** Finished alerts");
}

function checkConnection(context) {
    casper.echo("*** Checking connection in " + context);

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.connection.status();
    }, "online", "The connection is online");

    // set connection to offline
    casper.evaluate(function() {
        APP.connection.status("offline");
    });

    // screenshot of the page with connection alert
    capture("connection-offline");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.connection.status();
    }, "offline", "The connection is offline");

    // test the alert is visible
    casper.test.assertVisible(".viewport #page-alert");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, true, "The connection alert is shown");

    // set connection to online again
    casper.evaluate(function() {
        APP.connection.status("online");
    });

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.connection.status();
    }, "online", "The connection is online");

    // test the alert is hidden
    casper.test.assertNotVisible(".viewport #page-alert");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.alert.status();
    }, false, "The connection alert is hidden");

    casper.echo("*** Finished connection");
}

function checkEvents(context) {
    casper.echo("*** Checking events in " + context);

    casper.echo("*** Finished events");
}

function checkLoader(context) {
    casper.echo("*** Checking loader in " + context);

    // loader
    casper.test.assertExists(".viewport > #loader");
    casper.test.assertNotVisible("#loader");
    casper.test.assertExists("#loader.loader");
    casper.test.assertExists("#loader.loader img");
    casper.test.assertExists("#loader.loader img.spinner");
    casper.test.assertExists("#loader.loader .loader-text");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.loader.status();
    }, false, "Loader is hidden");

    // open an alert
    casper.evaluate(function() {
        APP.loader.show("Hello Casper!");
    });

    // test the alert is visible
    casper.test.assertVisible("#loader");

    // test it has the correct text
    casper.test.assertSelectorHasText('#loader .loader-text', "Hello Casper!");

    // screenshot of the page with loader
    capture("show-loader");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.loader.status();
    }, true, "Loader is shown");

    // hide the loader
    casper.evaluate(function() {
        APP.loader.hide();
    });

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.loader.status();
    }, false, "Loader is hidden");

    casper.echo("*** Finished loader");
}

function checkModal(context) {
    casper.echo("*** Checking modals in " + context);

    casper.echo("*** Finished modals");
}

function checkNav(context) {
    casper.echo("*** Checking navigation in " + context);

    // page navigation
    casper.test.assertExists(".viewport > #page-navigation");
    casper.test.assertExists("#page-navigation.page-navigation");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .navigation-header");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .action-nav-item");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .action-nav-item.navigation-item");
    casper.test.assertExists("#page-navigation.page-navigation.overthrow .action-nav-item.navigation-item.navigation-item-active");
    casper.test.assertExists(".viewport > .page-navigation-toggle");
    casper.test.assertExists(".page-navigation-toggle.action-hide-nav");

    if (context === "website") {

    } else if (context === "webapp") {

    }

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.nav.status();
    }, false, "Navigation is hidden");

    casper.test.assertNotExists(".has-navigation");

    // show navigation
    casper.evaluate(function() {
        APP.nav.show();
    });

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.nav.status();
    }, true, "Navigation is shown");

    casper.test.assertExists(".has-navigation");

    // screenshot of the page with navigation
    capture("show-nav");

    // hide the navigation
    casper.evaluate(function() {
        APP.nav.hide();
    });

    casper.test.assertNotExists(".has-navigation");

    // check reported status
    casper.test.assertEvalEquals(function() {
        return APP.nav.status();
    }, false, "Navigation is hidden");


    casper.echo("*** Finished navigation");
}

function checkOpen() {
    casper.echo("*** Checking page loading...");

    casper.echo("*** Finished page loading");
}

function checkPhone() {
    casper.echo("*** Checking Phonegap integration...");

    casper.echo("*** Finished Phonegap integration");
}

function checkTabs() {
    casper.echo("*** Checking tabs...");

    casper.echo("*** Finished tabs");
}

function checkUtil() {
    casper.echo("*** Checking util...");

    casper.echo("*** Finished util");
}

function checkViews() {
    casper.echo("*** Checking views...");

    casper.echo("*** Finished views");
}

function runTests(context) {

    checkAlert();
    checkConnection();
    checkLoader();
    checkNav(context);
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

casper.then(function() {

    runTests("website");
});


/***

    Start running the tests in webapp mode

***/

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

casper.then(function() {

    runTests("webapp");
});

// Run it
casper.run(function() {
    this.echo("We're done!").exit();
});