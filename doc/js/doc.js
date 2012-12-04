/**
 * Module for handling scrolling and pushing events to Andamio iframe
 */
APP.doc = (function () {

    // Variables
    var andamio,
        content,
        contentHeight,
        boxes,
        current,
        previous,
        topCache,
        iphone,
        nav;

    /**
     * Dynamic loading of navigation tabs
     */
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

    /*
     * Sets up variables used to do the scroll detection
     */
    function initScroll() {

        contentHeight   = content.height() / 2;
        boxes           = content.find(".js-box");
        current         = 0;
        previous        = 0;
        topCache        = boxes.map(function() { return $(this).offset().top;});
    }

    /**
     * Attach event listeners
     */
    function attachScrollListeners() {

        content.on("scroll", calculateScroll);

        APP.events.attachClickHandler(".action-app-reset", function () {

            andamio.location.reload();
        });
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        // Listen to the global ajaxComplete event to trigger syntax highlighting
        $(document).on("ajaxSuccess", function() {

            var loadSource = content.find('[data-src]');
            // console.log(loadSource.length);

            if (loadSource.length > 0) {

                loadSource.each(function(i, elem) {
                    var src = $(elem).data('src');

                    $.ajax({
                        url: src,
                        global: false,
                        success: function(data) {
                            $(elem).text(data);
                            Prism.highlightElement(elem);
                            if (andamio) initScroll();
                        }
                    });
                });
            } else {

                if (andamio) initScroll();
                Prism.highlightAll();
            }
        });
    }

    /**
     *
     */
    function init() {

        content = APP.views.parentView().find(".js-content");
        iphone  = $("#iphone");
        nav     = $("#nav");
        loadTabs();
        attachListeners();

        if (document.width >= 980) {
            initScroll();

            // iframe injection with onload handler http://www.nczonline.net/blog/2009/09/15/iframes-onload-and-documentdomain/
            var iframe = document.createElement("iframe");
                iframe.src = "tests/index.html?webapp=1";
                iframe.className = "iphone-content";

            iframe.onload = function(){

                andamio = iframe.contentWindow;
                attachListeners();
            };

            iphone.append(iframe);

            attachScrollListeners();
        } else {
            andamio = false;
        }
    }

    return {
        "init": init
    };

})();
