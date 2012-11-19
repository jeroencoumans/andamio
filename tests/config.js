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

function capture(filename) {
    // uncomment if you want to capture screenshots
    // return true;

    casper.capture("tests/screenshots/" + filename + '.png');
}

function setupBrowser() {
    // set iPhone UA
    casper.userAgent(userAgentIPhone5);

    // set iPhone dimensions
    casper.viewport(320, 480);
}