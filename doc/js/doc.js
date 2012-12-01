/**
 * Module for handling scrolling and pushing events to Andamio iframe
 */
APP.doc = (function () {

    // Variables
    var iframe,
        andamio,
        content,
        contentHeight,
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
    }

    /**
     * Checks the scrollposition and updates the active boxes
     */
    function calculateScroll() {

        // Save scrollTop value
        var currentBox,
            currentTop = content.scrollTop(),
            actionIn,
            actionOut;

        // console.log(currentTop);

        // Injection of boxess into phone
        for (var i = boxes.length; i--;) {
            if ((topCache[i] - currentTop) < contentHeight) {
                if (current == i) return;

                previous = content.find('.box.active');
                actionOut = previous.data("app-out");

                current = i;
                currentBox = $(boxes[i]);
                actionIn = currentBox.data("app-in");

                console.log(actionIn);
                console.log(actionOut);

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

        content.on("scroll", calculateScroll);

        APP.events.attachClickHandler(".action-app-reset", function () {

            andamio.location.reload();
        });

    }

    /**
     * Check wether we use native or HTML spinner
     */
    function init() {

        content         = APP.views.parentView().find(".js-content");
        contentHeight   = content.height() / 2;
        boxes           = content.find(".js-box");
        current         = 0;
        previous        = 0;
        topCache        = boxes.map(function () { return $(this).offset().top });
        iphone          = $("#iphone");
        nav             = $("#nav");

        console.log(contentHeight);

        // iframe injection with onload handler http://www.nczonline.net/blog/2009/09/15/iframes-onload-and-documentdomain/
        var iframe = document.createElement("iframe");
            iframe.src = "tests/index.html?webapp=1";
            iframe.className = "iphone-content";

        iframe.onload = function(){
            console.log("Andamio loaded");
            andamio = iframe.contentWindow;
            attachListeners();
        };

        // updateNav();
        iphone.append(iframe);
    }

    return {
        "init": init
    };

})();
