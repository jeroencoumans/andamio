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
     * Checks the scrollposition and updates the active boxes
     */
    function calculateScroll() {

        // Save scrollTop value
        var currentBox,
            currentTop = content.scrollTop(),
            actionIn,
            actionOut;

        // Injection of boxess into phone
        for (var i = boxes.length; i--;) {
            if ((topCache[i] - currentTop) < contentHeight) {
                if (current == i) return;

                previous = content.find('.box.active');
                actionOut = previous.data("app-out");

                current = i;
                currentBox = $(boxes[i]);
                actionIn = currentBox.data("app-in");

                previous.removeClass('active');
                currentBox.addClass("active");

                if (actionOut && andamio) andamio.eval(actionOut);
                if (actionIn && andamio) andamio.eval(actionIn);

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

        // Listen to the global ajaxComplete event to trigger syntax highlighting and reset the scroll variables
        $(document).on("ajaxSuccess", function() {

            initScroll();
            Prism.highlightAll();
        });
    }

    function initScroll() {

        content         = APP.views.parentView().find(".js-content");
        contentHeight   = content.height() / 2;
        boxes           = content.find(".js-box");
        current         = 0;
        previous        = 0;
        topCache        = boxes.map(function () { return $(this).offset().top });
    }

    function loadTabs() {

        var tabJS = $("#tab-js");

        $.ajax({
            url: "doc/api/index.html",
            timeout: 7500,
            headers: { "X-PJAX": true },
            success: function(response) {

                tabJS.html(response);
            }
        });
    }

    /**
     *
     */
    function init() {

        initScroll();
        iphone = $("#iphone");
        nav    = $("#nav");
        loadTabs();

        if (document.width >= 980) {
            // iframe injection with onload handler http://www.nczonline.net/blog/2009/09/15/iframes-onload-and-documentdomain/
            var iframe = document.createElement("iframe");
                iframe.src = "tests/index.html?webapp=1";
                iframe.className = "iphone-content";

            iframe.onload = function(){

                andamio = iframe.contentWindow;
                attachListeners();
            };

            iphone.append(iframe);
        } else {
            andamio = false;
            attachListeners();
        }
    }

    return {
        "init": init
    };

})();
