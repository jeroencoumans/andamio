var isParentView = function (context) {
    casper.test.assertEval(function () {
        return Andamio.views.currentView === Andamio.views.parentView;
    }, "Current view is the parentView");

    casper.test.assertEval(function () {
        return Andamio.views.currentUrl === Andamio.views.parentView.url;
    }, "CurrentURL is parentView.url");

    casper.test.assertEval(function () {
        return Andamio.views.parentView.active;
    }, "childView is active");
};

var isChildView = function (context) {
    casper.test.assertEval(function () {
        return Andamio.views.currentView === Andamio.views.childView;
    }, "Current view is the childView");

    casper.test.assertEval(function () {
        return Andamio.views.currentUrl === Andamio.views.childView.url;
    }, "CurrentURL is childView.url");

    casper.test.assertEval(function () {
        return Andamio.views.childView.active;
    }, "childView is active");
};

var isChildViewAlt = function (context) {
    casper.test.assertEval(function () {
        return Andamio.views.currentView === Andamio.views.childViewAlt;
    }, "Current view is the childViewAlt");

    casper.test.assertEval(function () {
        return Andamio.views.currentUrl === Andamio.views.childViewAlt.url;
    }, "CurrentURL is childViewAlt.url");

    casper.test.assertEval(function () {
        return Andamio.views.childViewAlt.active;
    }, "childView is active");
};

var isModalView = function (context) {
    casper.test.assertEval(function () {
        return Andamio.views.currentView === Andamio.views.modalView;
    }, "Current view is the modalView");

    casper.test.assertEval(function () {
        return Andamio.views.currentUrl === Andamio.views.modalView.url;
    }, "CurrentURL is modalView.url");

    casper.test.assertEval(function () {
        return Andamio.views.modalView.active;
    }, "modalView is active");

    casper.test.assertEval(function () {
        return Andamio.views.modalCount === 1;
    }, "modalCount is 1");

};

var isMediaView = function (context) {
    casper.test.assertEval(function () {
        return Andamio.views.currentView === Andamio.views.mediaView;
    }, "Current view is the mediaView");

    casper.test.assertEval(function () {
        return Andamio.views.currentUrl === Andamio.views.mediaView.url;
    }, "CurrentURL is mediaView.url");

    casper.test.assertEval(function () {
        return Andamio.views.mediaView.active;
    }, "mediaView is active");
};

var initialState = function (context) {

    // test wether the pageLoader exists and contains 1 element
    casper.test.assertEvalEquals(function () {
        return Andamio.dom.pageView.length;
    }, 1, "Andamio.dom.pageView returns 1 element");

    casper.test.assertEvalEquals(function () {
        return Andamio.dom.parentView.length;
    }, 1, "Andamio.dom.parentView returns 1 element");

    casper.test.assertEvalEquals(function () {
        return Andamio.dom.childView.length;
    }, 1, "Andamio.dom.childView returns 1 element");

    casper.test.assertEvalEquals(function () {
        return Andamio.dom.childViewAlt.length;
    }, 1, "Andamio.dom.childViewAlt returns 1 element");

    casper.test.assertEvalEquals(function () {
        return Andamio.dom.modalView.length;
    }, 1, "Andamio.dom.modalView returns 1 element");

    casper.test.assertEvalEquals(function () {
        return Andamio.dom.mediaView.length;
    }, 1, "Andamio.dom.mediaView returns 1 element");

    // test initial status
    isParentView(context);

    casper.test.assertEval(function () {
        return Andamio.views.currentUrl === Andamio.config.initialView;
    }, "Initial URL is loaded");

    capture(context + "-views-initial");
};

var testChildCount = function(context, childCount) {

    if (childCount === 0) {
        isParentView(context);
    }

    else if (childCount % 2 === 1) {
        isChildView(context);
    }

    else if (childCount % 2 === 0) {
        isChildViewAlt(context);
    }

    casper.test.assertEvalEquals(function () {
        return Andamio.views.childCount;
    }, childCount, "Andamio.views.childCount is " + childCount);

    var arrLength = childCount + 1;

    casper.test.assertEvalEquals(function () {
        return Andamio.views.viewHistory.length;
    }, arrLength, "Andamio.views.viewHistory.length is " + arrLength);

    casper.test.assertEvalEquals(function () {
        return Andamio.views.urlHistory.length;
    }, arrLength, "Andamio.views.urlHistory.length is " + arrLength);

    casper.test.assertEvalEquals(function () {
        return Andamio.views.scrollHistory.length;
    }, childCount, "Andamio.views.scrollHistory.length is " + childCount);

    capture(context + "-views-child-" + childCount);
};

var testChildFlow = function (context) {

    casper.then(function () {
        casper.test.info("Scrolling down");
        scrollDown(context);
    });

    casper.then(function () {

        testChildCount(context, 0);
    });

    casper.then(function () {

        casper.test.info("Opening childView");
        casper.click(".js-parent-view .media-object-list .action-push:first-child");
    });

    casper.waitFor(function () {
        return casper.evaluate(function () {
            return Andamio.views.childView.url === "blocks/child.html";
        });
    });

    casper.then(function () {
        casper.test.info("Scrolling down");
        scrollDown(context);
    });

    casper.then(function () {

        testChildCount(context, 1);
    });

    casper.then(function () {
        casper.test.info("Opening childViewAlt");
        casper.click(".js-child-view .media-object-list .action-push:first-child");
    });

    casper.waitFor(function () {
        return casper.evaluate(function () {
            return Andamio.views.childViewAlt.url === "blocks/child-alt.html";
        });
    });

    casper.then(function () {
        casper.test.info("Scrolling down");
        scrollDown(context);
    });

    casper.then(function () {

        testChildCount(context, 2);
    });

    casper.then(function () {
        casper.test.info("Opening another childView");
        casper.click(".js-child-view-alternate .button-pills .action-push");
    });

    casper.waitFor(function () {
        return casper.evaluate(function () {
            return Andamio.views.childView.url === "blocks/child.html";
        });
    });

    casper.then(function () {
        casper.test.info("Scrolling down");
        scrollDown(context);
    });

    casper.then(function () {

        testChildCount(context, 3);
    });
}

var testChildBack = function(context) {

    var scrollHistory = casper.evaluate(function () {
        return Andamio.views.scrollHistory;
    });

    casper.then(function () {

        casper.test.info("Going back to scrollPosition " + scrollHistory[2]);
        casper.click(".js-child-view .page-header .action-pop");
    });

    casper.waitFor(function () {
        return casper.evaluate(function () {
            return Andamio.views.childViewAlt.active;
        });
    });

    casper.then(function () {

        casper.test.assertEvalEquals(function () {
            return Andamio.views.currentView.scroller[0].scrollTop;
        }, scrollHistory[2], "Andamio.views.currentView.scroller[0].scrollTop is " + scrollHistory[2]);

        testChildCount(context, 2);
    });

    casper.then(function () {

        casper.test.info("Going back to scrollPosition " + scrollHistory[1]);
        casper.click(".js-child-view-alternate .page-header .action-pop");
    });

    casper.waitFor(function () {
        return casper.evaluate(function () {
            return Andamio.views.childView.active;
        });
    });

    casper.then(function () {

        testChildCount(context, 1);
    });

    casper.then(function () {

        casper.test.info("Going back to scrollPosition " + scrollHistory[2]);
        casper.click(".js-child-view .page-header .action-pop");
    });

    casper.waitFor(function () {
        return casper.evaluate(function () {
            return Andamio.views.parentView.active;
        });
    });

    casper.then(function () {

        testChildCount(context, 0);
    });
}

var testModals = function(context) {

    casper.then(function () {

        casper.test.info("Opening modalView");
        casper.click(".parent-view .action-show-modal");
    });

    casper.waitFor(function () {
        return casper.evaluate(function () {
            return Andamio.views.modalView.url === "blocks/modal.html";
        });
    });

    casper.then(function () {
        isModalView(context);
    });

    casper.then(function () {

        casper.test.info("Closing modalView");
        casper.click(".modal-view .action-hide-modal");
    });

    casper.waitFor(function () {
        return casper.evaluate(function () {
            return Andamio.views.modalView.active === false && Andamio.views.parentView.active === true;
        });
    });

    casper.then(function () {
        isParentView(context);
    });
}

var testMedia = function(context) {

    casper.then(function () {

        casper.test.info("Opening mediaView");
        casper.click(".parent-view .action-show-media");
    });

    casper.waitFor(function () {
        return casper.evaluate(function () {
            return Andamio.views.mediaView.url === "blocks/media.html";
        });
    });

    casper.then(function () {
        isMediaView(context);
    });

    casper.then(function () {

        casper.test.info("Closing mediaView");
        casper.click(".media-view .action-hide-media");
    });

    casper.waitFor(function () {
        return casper.evaluate(function () {
            return Andamio.views.mediaView.active === false && Andamio.views.parentView.active === true;
        });
    });

    casper.then(function () {
        isParentView(context);
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

// Test opening child views
casper.then(function () {

    testChildFlow("website");
});

// Test going back to parentview
casper.then(function () {

    testChildBack("website");
});

// Test opening parentView while in childView
casper.then(function () {

    testChildFlow("website");
});

casper.thenEvaluate(function () {
    Andamio.views.openParentPage("blocks/parent.html");
});

casper.waitFor(function () {
    return casper.evaluate(function () {
        return Andamio.views.parentView.active;
    });
});

// Test opening modals
casper.then(function () {
    testModals("website");
});

// Test opening modals
casper.then(function () {
    testMedia("website");
});

/***

    Webapp mode

***/
casper.thenOpen(localApp, function() {

    casper.test.info("*** Open webapp");
    casper.wait(ANIMATION_TIMEOUT, function() {
        initialState("webapp");
    });
});

casper.then(function () {

    testChildFlow("webapp");
});

casper.then(function () {

    testChildBack("webapp");
});

// Test opening parentView while in childView
casper.then(function () {

    testChildFlow("webapp");
});

casper.thenEvaluate(function () {
    Andamio.views.openParentPage("blocks/parent.html");
});

casper.waitFor(function () {
    return casper.evaluate(function () {
        return Andamio.views.parentView.active;
    });
});

casper.then(function () {
    testModals("webapp");
});

casper.then(function () {
    testMedia("webapp");
});

/*** End test ***/

casper.run(function () {
    this.test.done();
});
