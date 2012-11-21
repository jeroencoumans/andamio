/***

    Views module
    Interfaces:
    - openParentPage
    - openChildPage
    - hasChildPage

    Listeners:
    - action-push [TODO]
    - action-pop [TODO]

    Elements:
    - pageView [TODO]
    - parentView [TODO]
    - childView [TODO]


***/

function initialState(context) {

    // either webapp or website mode
    casper.test.info("*** Checking DOM of " + context);

    if (context === "webapp") {
        casper.test.assertExists(".webapp");
        casper.test.assertExists(".webapp .viewport");
    } else if (context === "website") {
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
}

function hasChildPage(boolean) {

    casper.test.assertEvalEquals(function() {
        return APP.views.hasChildPage();
    }, boolean, "APP.views.hasChildPage() returns " + boolean);
}

// check visibility and positioning of parent page
function checkParentPage(context) {

    casper.test.info("*** Checking parent page...");

    // check classes
    casper.test.assertExists(".viewport #page-view.page-view #child-view.child-view.view-hidden");
    casper.test.assertNotExists(".viewport #page-view.page-view #parent-view.parent-view.view-hidden");

    // check visibility if website
    if (context === "website") {

        casper.test.assertVisible("#parent-view", "Parent is visible");
        casper.test.assertNotVisible("#child-view", "Child is not visible");
    }

    // check position if webapp
    if (context === "webapp") {
        var parentPos = casper.getElementBounds("#parent-view");
        var childPos = casper.getElementBounds("#child-view");
        var viewportPos = casper.getElementBounds(".viewport");

        // check if parent is positioned left and top 0
        casper.test.assert(parentPos.left === viewportPos.left, "Parent is positioned left: " + parentPos.left + " of the viewport");
        casper.test.assert(parentPos.top === viewportPos.top, "Parent is positioned top: " + parentPos.top + " of the viewport");
        casper.test.assert(parentPos.width === viewportPos.width, "Parent width ("+ parentPos.width + ") is equal to viewport width (" + viewportPos.width + ")");
        casper.test.assert(parentPos.height === viewportPos.height, "Parent height ("+ parentPos.height + ") is equal to viewport height (" + viewportPos.height + ")");

        // check if child is positioned left equal to the width of the parent
        casper.test.assert(childPos.left === parentPos.width, "Child is positioned left (" + childPos.left + ") equal to the parent width (" + parentPos.width + ")");
        casper.test.assert(childPos.top === viewportPos.top, "Child is positioned top: " + childPos.top + " of the viewport");
        casper.test.assert(childPos.width === viewportPos.width, "Child width ("+ childPos.width + ") is equal to viewport width (" + viewportPos.width + ")");
        casper.test.assert(childPos.height === viewportPos.height, "Child height ("+ childPos.height + ") is equal to viewport height (" + viewportPos.height + ")");
    }

    // check reported status
    hasChildPage(false);
}

// check visibility and positioning of child page (this is a mirror of checkParentPage)
function checkChildPage(context) {

    casper.test.info("*** Checking child page...");

    // check classes
    casper.test.assertExists(".viewport #page-view.page-view #parent-view.parent-view.view-hidden");
    casper.test.assertNotExists(".viewport #page-view.page-view #child-view.child-view.view-hidden");

    // check visibility if website
    if (context === "website") {

        casper.test.assertVisible("#child-view", "Child is visible");
        casper.test.assertNotVisible("#parent-view", "Parent is not visible");
    }

    // check position if webapp
    if (context === "webapp") {
        var parentPos = casper.getElementBounds("#parent-view");
        var childPos = casper.getElementBounds("#child-view");
        var viewportPos = casper.getElementBounds(".viewport");

        // check if parent is positioned left off screen
        casper.test.assert(parentPos.left === -(parentPos.width), "Parent is positioned left: " + parentPos.left + " equal to its width (" + parentPos.width + ")");
        casper.test.assert(parentPos.top === viewportPos.top, "Parent is positioned top: " + parentPos.top + " of the screen");

        // check if child is positioned left to the viewport
        casper.test.assert(childPos.left === viewportPos.left, "Child is positioned left (" + childPos.left + ") of the viewport");
        casper.test.assert(childPos.top === viewportPos.top, "Child is positioned top: " + childPos.top + " of the viewport");
        casper.test.assert(childPos.width === viewportPos.width, "Child width ("+ childPos.width + ") is equal to viewport width (" + viewportPos.width + ")");
        casper.test.assert(childPos.height === viewportPos.height, "Child height ("+ childPos.height + ") is equal to viewport height (" + viewportPos.height + ")");
    }

    // check reported status
    hasChildPage(true);
}

function openChildPage(context) {

    casper.test.info("*** Opening a child page...");
    casper.evaluate(function() {
        APP.views.openChildPage("box2.html", "Casper Child page");
    });

    casper.wait(ANIMATION_TIMEOUT, function() {
        checkChildPage(context);

        casper.test.assertSelectorHasText("#child-view .js-title", "Casper Child page");
    });
}



/***

    Start running the tests in website mode

***/

casper.start(localSite, function () {
    setupBrowser();

    casper.test.info("*** Open website");
    initialState("website");
});

casper.then(function () { checkParentPage("website"); });
casper.then(function () { capture("website-views-parent-view"); });
casper.then(function () { openChildPage("website"); });
casper.then(function () { capture("website-views-child-view");});

/***

    Then start running the tests in webapp mode

***/

casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    initialState("webapp");
});

casper.then(function () { checkParentPage("webapp");});
casper.then(function () { capture("webapp-views-parent-view");});
casper.then(function () { openChildPage("webapp");});
casper.then(function () { capture("webapp-views-child-view");});


/*** End test ***/

casper.run(function() {
    this.test.done();
});