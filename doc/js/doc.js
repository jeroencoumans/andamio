/**
 * Module for handling scrolling and pushing events to Andamio iframe
 */
APP.doc = (function () {

    // Variables
    var iframe,
        andamio,
        win,
        winHeight,
        viewport,
        boxes,
        current,
        previous,
        topCache,
        iphone,
        nav;

    /**
     * Populates the navigation
     */
    function updateNav() {

        for (var i=0;i<boxes.length;i++) {
            var currentBox  = $(boxes[i]),
                boxId       = currentBox.attr("id"),
                boxTitle    = currentBox.find(".box-header").text();

            if (! boxId || ! boxTitle) return;

            nav.append('<a href="#' + boxId + '" class="button">' + boxTitle + '</a>');
        }

        console.log(boxes);
    }

    /**
     * Checks the scrollposition and updates the active boxes
     */
    function calculateScroll() {

        // Save scrollTop value
        var currentBox,
            currentTop = win.scrollTop(),
            actionIn,
            actionOut;

        // console.log(currentTop);

        // Injection of boxess into phone
        for (var i = boxes.length; i--;) {
            if ((topCache[i] - currentTop) < winHeight) {
                if (current == i) return;

                previous = viewport.find('.box.active');
                actionOut = previous.data("app-out");
                current = i;
                currentBox = $(boxes[i]);
                actionIn = currentBox.data("app-in");

                previous.removeClass('active');
                currentBox.addClass("active");

                if (actionOut) andamio.eval(actionOut);
                if (actionIn) andamio.eval(actionIn);

                break;
            }
        }
    }


    /**
     * Attach event listeners
     */
    function attachListeners() {

        win.on("scroll", calculateScroll);

        APP.events.attachClickHandler(".action-app-reset", function () {

            andamio.location.reload();
        });

        iphone.on("scroll", function(event) {
            console.log("Scrolling in the iPhone?");

            event.preventDefault();
        });
    }

    /**
     * Check wether we use native or HTML spinner
     */
    function init() {

        win             = $(window);
        winHeight       = $(window).height() / 3;
        boxes           = $(".box");
        current         = 0;
        previous        = 0;
        topCache        = boxes.map(function () { return $(this).offset().top });
        viewport        = $("body");
        iphone          = $("#iphone");
        nav             = $("#nav");

        // iframe injection with onload handler http://www.nczonline.net/blog/2009/09/15/iframes-onload-and-documentdomain/
        var iframe = document.createElement("iframe");
            iframe.src = "tests/index.html?webapp=1";
            iframe.className = "iphone-content";

        iframe.onload = function(){
            console.log("Andamio loaded");
            andamio = iframe.contentWindow;
            attachListeners();
        };

        updateNav();
        iphone.append(iframe);
    }

    return {
        "init": init
    };

})();
