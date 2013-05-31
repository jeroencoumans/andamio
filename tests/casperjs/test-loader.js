/***



***/

function initialState(context) {

    // test wether the pageLoader exists and contains 1 element
    casper.test.assertEvalEquals(function () {
        return Andamio.dom.pageLoader.length;
    }, 1, "Andamio.dom.pageLoader returns 1 element");

    casper.test.assertEvalEquals(function () {
        return typeof Andamio.dom.pageLoaderText;
    }, "string", "Andamio.dom.pageLoaderText returns a string");

    // test initial status
    casper.test.assertEvalEquals(function () {
        return Andamio.loader.status;
    }, false, "Andamio.loader.status returns false (loader is hidden)");
}

var isShown = function() {
    return casper.evaluate(function() {
        return Andamio.loader.status;
    });
};

var isHidden = function() {
    return casper.evaluate(function() {
        return Andamio.loader.status === false;
    });
};

function isShown() {

    casper.test.assertEvalEquals(function() {
        return Andamio.loader.status;
    }, true, "Loader is shown");
}

function testHidden() {

    casper.test.assertEvalEquals(function() {
        return Andamio.loader.status;
    }, false, "Loader is hidden");
}

function show(context) {

    casper.evaluate(function() {
        Andamio.loader.show("Hello Andamio");
    });

    casper.waitFor(isShown);

    casper.then(function () {
        isShown();
        capture(context + "-loader-show");
    });

    casper.thenEvaluate(function () {
        return Andamio.dom.pageLoaderText;
    }, "Hello Andamio");
}

function hide(context) {

    casper.evaluate(function() {
        Andamio.loader.hide();
    });

    casper.waitFor(isHidden);

    casper.then(function() {
        testHidden(context);
        capture(context + "-loader-hide");
    });
}

/***

    Start running the tests

***/

casper.start(localSite, function () {
    setupBrowser();

    casper.test.info("*** Open website");
    initialState("website");
});

casper.then(function() {

    show("website");
});

casper.then(function() {

    hide("website");
});

casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    initialState("webapp");
});

casper.then(function() {

    show("webapp");
});

casper.then(function() {

    hide("webapp");
});

/*** End test ***/

casper.run(function() {
    this.test.done();
});
