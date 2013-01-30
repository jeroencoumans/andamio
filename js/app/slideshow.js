/*jshint latedef:true, undef:true, unused:true boss:true */
/*global APP, $, Swipe, document */

/**
 * Module for setting up swipe.js
 */
APP.slideshow = (function () {

    var slideShow,
        slideShowDotsWrapper,
        slideShowDotsItems;

    function prev() {

        if (slideShow) {
            slideShow.prev();
        }
    }

    function next() {

        if (slideShow) {
            slideShow.next();
        }
    }

    function slide(index) {

        if (slideShow) {
            slideShow.slide(index, 300);
        }
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-slideshow-next", function () {
            slideShow.next();
        });

    }

    function init(id) {

        slideShowDotsWrapper = $('<div class="slideshow-dots"></div>');

        slideShow = new Swipe(document.getElementById(id), {
            startSlide: 0,
            speed: 300,
            continuous: true,
            disableScroll: false,
            callback: function (index, item) {
                slideShowDotsWrapper.find(".active").removeClass("active");
                $(slideShowDotsItems[index]).addClass("active");
                var img = $(item).find(".js-slideshow-media");
                if (img) img.attr("src", img.data("src"));
            }
        });

        // generate dots
        for (var i=0;i<slideShow.length;i++) {
            slideShowDotsWrapper.append($('<div class="slideshow-dot"></div>'));
        }

        slideShowDotsItems = slideShowDotsWrapper.find(".slideshow-dot");

        // set first to active
        slideShowDotsItems.first().addClass("active");

        // insert after the swipe container
        slideShowDotsWrapper.insertAfter(slideShow.container);

        attachListeners();
    }

    return {
        "init": init,
        "prev": prev,
        "next": next,
        "slide": slide
    };
})();
