/***

    Page module

    Interfaces:
    - page
    - refresh

    Elements:
    - activeUrl
    - parentUrl
    - childUrl
    - modalUrl

    Listeners:
    - action-refresh [TODO]

***/


/***

    Wrapper function that will fire off the actual page loading depending on the view
    I had to split these up since I couldn't find a way to pass the view function as
    parameter to loadPage...

***/

function loadParent(context, url, refresh) {

    if (refresh) {

        casper.test.info("*** Refreshing parent page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.dom.parentView, "refresh");
        }, {
            url: url
        });
    } else {

        casper.test.info("*** Loading parent page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.dom.parentView);
        }, {
            url: url
        });
    }
}


function loadChild(context, url, refresh) {

    if (refresh) {

        casper.test.info("*** Refreshing child page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.dom.childView, "refresh");
        }, {
            url: url
        });
    } else {

        casper.test.info("*** Loading child page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.dom.childView);
        }, {
            url: url
        });
    }
}


function loadModal(context, url, refresh) {

    if (refresh) {

        casper.test.info("*** Refreshing modal page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.dom.modalView, "refresh");
        }, {
            url: url
        });
    } else {

        casper.test.info("*** Loading modal page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.dom.modalView);
        }, {
            url: url
        });
    }
}

function checkBox2(view) {

    // test wether the activeUrl returns the expected URL
    var activeUrl = casper.evaluate(function () {
        if (APP.open.activeUrl() === "blocks/box2.html") {
            return true;
        } else {
            return false;
        }
    });

    // test the result
    casper.test.assert(activeUrl, "APP.open.activeUrl() is blocks/box2.html");

    // Call the correct view
    switch (view) {
        case "parent":
            casper.test.assertExists('#parent-view #box-2', 'Box 2 exists in parent');

            // test wether the parentUrl returns the expected URL
            var currentUrl = casper.evaluate(function () {
                if (APP.open.parentUrl() === "blocks/box2.html") {
                    return true;
                } else {
                    return false;
                }
            });

            casper.test.assert(currentUrl, "APP.open.parentUrl() is blocks/box2.html");
            break;

        case "child":
            casper.test.assertExists('#child-view #box-2', 'Box 2 exists in child');

            // test wether the parentUrl returns the expected URL
            var currentUrl = casper.evaluate(function () {
                if (APP.open.childUrl() === "blocks/box2.html") {
                    return true;
                } else {
                    return false;
                }
            });

            casper.test.assert(currentUrl, "APP.open.childUrl() is blocks/box2.html");
            break;

        case "modal":
            casper.test.assertExists('#modal-view #box-2', 'Box 2 exists in modal');

            // test wether the parentUrl returns the expected URL
            var currentUrl = casper.evaluate(function () {
                if (APP.open.modalUrl() === "blocks/box2.html") {
                    return true;
                } else {
                    return false;
                }
            });

            casper.test.assert(currentUrl, "APP.open.modalUrl() is blocks/box2.html");
            break;
    }
}

/***

    Start running the tests in website mode
    For each view (parent, child, modal), we open, check, refresh and check the content

***/

casper.start(localSite, function () {
    setupBrowser();

    casper.test.info("*** Open website");
    validateContext("website");
});

casper.then(function() {

    loadParent("website", "blocks/box2.html");
});

casper.then(function() {

    checkBox2("parent");
    capture("website-open-page-parent");
});

casper.then(function() {
    loadParent("website", "blocks/box2.html", "refresh");
});

casper.then(function() {

    checkBox2("parent");
    capture("website-open-refresh-parent");
});

casper.thenOpen(localSite, function() {

    loadChild("website", "blocks/box2.html");
});

casper.then(function() {

    checkBox2("child");
    capture("website-open-page-child");
});

casper.then(function() {
    loadChild("website", "blocks/box2.html", "refresh");
});

casper.then(function() {

    checkBox2("child");
    capture("website-open-refresh-child");
});

casper.thenOpen(localSite, function() {
    loadModal("website", "blocks/box2.html");
});

casper.then(function() {

    checkBox2("modal");
    capture("website-open-page-modal");
});

casper.then(function() {
    loadModal("website", "blocks/box2.html", "refresh");
});

casper.then(function() {

    checkBox2("modal");
    capture("website-open-refresh-modal");
});

/***

    The webapp tets

***/

casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    validateContext("webapp");
});


casper.then(function() {

    loadParent("webapp", "blocks/box2.html");
});

casper.then(function() {

    checkBox2("parent");
    capture("webapp-open-page-parent");
});

casper.then(function() {
    loadParent("webapp", "blocks/box2.html", "refresh");
});

casper.then(function() {

    checkBox2("parent");
    capture("webapp-open-refresh-parent");
});

casper.thenOpen(localSite, function() {

    loadChild("webapp", "blocks/box2.html");
});

casper.then(function() {

    checkBox2("child");
    capture("webapp-open-page-child");
});

casper.then(function() {
    loadChild("webapp", "blocks/box2.html", "refresh");
});

casper.then(function() {

    checkBox2("child");
    capture("webapp-open-refresh-child");
});

casper.thenOpen(localSite, function() {
    loadModal("webapp", "blocks/box2.html");
});

casper.then(function() {

    checkBox2("modal");
    capture("webapp-open-page-modal");
});

casper.then(function() {
    loadModal("webapp", "blocks/box2.html", "refresh");
});

casper.then(function() {

    checkBox2("modal");
    capture("webapp-open-refresh-modal");
});

/*** End test ***/

casper.run(function() {
    this.test.done();
});
