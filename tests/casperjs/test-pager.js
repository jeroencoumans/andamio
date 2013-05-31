var checkChildren = function (context, children) {
    casper.test.assertEvalEquals(function () {
        return APP.pagers.parentView.options.pagerWrapper.children().length;
    }, children, 'pagerWrapper contains this many children: ' + children);
}

var checkPagenumber = function (context, pageNumber) {

    casper.test.assertEvalEquals(function () {
        return APP.pagers.parentView.options.pageNumber;
    }, pageNumber, 'APP.pagers.parentView.options.pageNumber is ' + pageNumber);
}

var checkStatus = function (context, status) {

    casper.test.assertEvalEquals(function () {
        return APP.pagers.parentView.status ? "enabled" : "disabled";
    }, status, 'APP.pagers.parentView is ' + status);
}

var checkSpinner = function (context, status) {

    casper.test.assertEvalEquals(function () {
        return APP.pagers.parentView.spinner.hasClass("display-none") ? 'invisible' : 'visible';
    }, status, 'APP.pagers.parentView.loadMoreAction is ' + status);
}

var checkLoadMoreButton = function (context, status) {

    casper.test.assertEvalEquals(function () {
        return APP.pagers.parentView.loadMoreAction.hasClass("display-none") ? 'invisible' : 'visible';
    }, status, 'APP.pagers.parentView.loadMoreAction is ' + status);
}

var checkNoMoreItems = function (context, status) {

    casper.test.assertEvalEquals(function () {
        return Andamio.views.currentView.content.find(APP.pagers.parentView.noMorePages).length === 0 ? "invisible" : "visible";
    }, status, "APP.pagers.parentView.noMorePages is " + status);
}

var initialState = function (context) {

    casper.test.assertEval(function () {
        return typeof APP.pagers.parentView === 'object';
    }, 'APP.pagers.parentView is an object');

    checkStatus(context, "enabled");
    checkChildren(context, 10);
    checkPagenumber(context, 0);
    checkSpinner(context, "visible");
    checkLoadMoreButton(context, "invisible");
    checkNoMoreItems(context, "invisible");

    capture(context + "-pager-initial");
}

var loadNext = function (context) {

    casper.test.info("Loading page 1...");

    casper.evaluate(function () {
        APP.pagers.parentView.loadNextPage();
    });

    casper.test.info("Waiting...");

    casper.waitFor(function check() {
        return casper.evaluate(function() {
            return APP.pagers.parentView.options.pagerWrapper.children().length > 10;
        });
    })

    casper.test.info("Checking...");

    casper.then(function () {
        checkChildren(context, 20);
        checkStatus(context, "enabled");
        checkPagenumber(context, 1);
        checkLoadMoreButton(context, "visible");
        checkNoMoreItems(context, "invisible");
        capture(context + "-pager-1");
    });

    casper.then(function () {

        casper.test.info("Loading page 2...");
        casper.click(".action-load-more");
    });

    casper.then(function () {
        checkChildren(context, 30);
        checkStatus(context, "enabled");
        checkPagenumber(context, 2);
        checkLoadMoreButton(context, "visible");
        checkNoMoreItems(context, "invisible");
        capture(context + "-pager-2");
    });

    casper.then(function () {

        casper.test.info("Loading page 3...");
        casper.click(".action-load-more");
    });

    casper.then(function () {
        checkChildren(context, 32);
        checkStatus(context, "disabled");
        checkPagenumber(context, 3);
        checkNoMoreItems(context, "visible");
        capture(context + "-pager-3");
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

    loadNext("website");
});

casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    initialState("webapp");
});

casper.then(function() {

    loadNext("webapp");
});

/*** End test ***/

casper.run(function() {
    this.test.done();
});
