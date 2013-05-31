/***

    Global variables

***/

var userAgentIPhone5 = "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3 casperjs";

var localSite   = "http://localhost/andamio/tests/",
    localApp    = "http://localhost/andamio/tests/?webapp=1",
    githubSite  = "http://jeroencoumans.github.com/andamio/tests/",
    githubApp   = "http://jeroencoumans.github.com/andamio/tests/?webapp=1";

ANIMATION_TIMEOUT = 500;

/***

    Utility functions

***/

var capture = function(filename) {
    // uncomment if you want to capture screenshots
    // return true;

    casper.capture("tests/screenshots/" + filename + '.png');
}

var setupBrowser = function() {
    // set iPhone UA
    casper.userAgent(userAgentIPhone5);

    // set iPhone dimensions
    casper.viewport(320, 480);

    // make sure to manually clear cache
    casper.evaluate(function () {
        localStorage.clear();
    })
}

var scrollDown = function (context) {

    casper.evaluate(function () {

        if (Andamio.config.webapp) {
            (function (s) {
                s[0].scrollTop = s[0].scrollHeight;
            })(Andamio.views.currentView.scroller);
        } else {
            window.scrollTo(0, document.body.scrollHeight);
        }
    });
}