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
            APP.open.page(url, APP.views.parentView(), "refresh");
        }, {
            url: url
        });
    } else {

        casper.test.info("*** Loading parent page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.views.parentView());
        }, {
            url: url
        });
    }
}


function loadChild(context, url, refresh) {

    if (refresh) {

        casper.test.info("*** Refreshing child page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.views.childView(), "refresh");
        }, {
            url: url
        });
    } else {

        casper.test.info("*** Loading child page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.views.childView());
        }, {
            url: url
        });
    }
}


function loadModal(context, url, refresh) {

    if (refresh) {

        casper.test.info("*** Refreshing modal page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.modal.modalView(), "refresh");
        }, {
            url: url
        });
    } else {

        casper.test.info("*** Loading modal page");

        casper.evaluate(function(url) {
            APP.open.page(url, APP.modal.modalView());
        }, {
            url: url
        });
    }
}

function checkBox2(view) {

    // test wether the activeUrl returns the expected URL
    var activeUrl = casper.evaluate(function () {
        if (APP.open.activeUrl() === "box2.html") {
            return true;
        } else {
            return false;
        }
    });

    // test the result
    casper.test.assert(activeUrl, "APP.open.activeUrl() is box2.html");

    // Call the correct view
    switch (view) {
        case "parent":
            casper.test.assertExists('#parent-view #box-2', 'Box 2 exists in parent');

            // test wether the parentUrl returns the expected URL
            var currentUrl = casper.evaluate(function () {
                if (APP.open.parentUrl() === "box2.html") {
                    return true;
                } else {
                    return false;
                }
            });

            casper.test.assert(currentUrl, "APP.open.parentUrl() is box2.html");
            break;

        case "child":
            casper.test.assertExists('#child-view #box-2', 'Box 2 exists in child');

            // test wether the parentUrl returns the expected URL
            var currentUrl = casper.evaluate(function () {
                if (APP.open.childUrl() === "box2.html") {
                    return true;
                } else {
                    return false;
                }
            });

            casper.test.assert(currentUrl, "APP.open.childUrl() is box2.html");
            break;

        case "modal":
            casper.test.assertExists('#modal-view #box-2', 'Box 2 exists in modal');

            // test wether the parentUrl returns the expected URL
            var currentUrl = casper.evaluate(function () {
                if (APP.open.modalUrl() === "box2.html") {
                    return true;
                } else {
                    return false;
                }
            });

            casper.test.assert(currentUrl, "APP.open.modalUrl() is box2.html");
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
});

casper.then(function() {

    loadParent("website", "box2.html");
});

casper.then(function() {

    checkBox2("parent");
    loadParent("website", "box2.html", "refresh");
});

casper.then(function() {

    checkBox2("parent");
    capture("open-parent-website");
});

casper.thenOpen(localSite, function() {

    loadChild("website", "box2.html");
});

casper.then(function() {

    checkBox2("child");
    loadChild("website", "box2.html", "refresh");
});

casper.then(function() {

    checkBox2("child");
});

casper.thenOpen(localSite, function() {
    loadModal("website", "box2.html");
});

casper.then(function() {

    checkBox2("modal");
    loadModal("website", "box2.html", "refresh");
});

casper.then(function() {

    checkBox2("modal");
});

/***

    The webapp tets

***/

casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");

});

casper.then(function() {

    loadParent("website", "box2.html");
});

casper.then(function() {

    checkBox2("parent");
    loadParent("website", "box2.html", "refresh");
});

casper.then(function() {

    checkBox2("parent");
    capture("open-parent-webapp");
});

casper.thenOpen(localApp, function() {

    loadChild("website", "box2.html");
});

casper.then(function() {

    checkBox2("child");
    loadChild("website", "box2.html", "refresh");
});

casper.then(function() {

    checkBox2("child");
});

casper.thenOpen(localApp, function() {
    loadModal("website", "box2.html");
});

casper.then(function() {

    checkBox2("modal");
    loadModal("website", "box2.html", "refresh");
});

casper.then(function() {

    checkBox2("modal");
});

/*** End test ***/

casper.run(function() {
    this.test.done();
});