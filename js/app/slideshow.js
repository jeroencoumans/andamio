/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $, Swipe */

Andamio.slideshow = (function () {

    function SwipeDots(number) {

        if (typeof number === "number") {
            this.wrapper = $('<div class="slideshow-dots">');

            for (var i = 0; i < number; i++) {
                this.wrapper.append($('<div class="slideshow-dot"></div>'));
            }

            this.items = this.wrapper.find(".slideshow-dot");

            Object.defineProperties(this, {
                active: {
                    get: function () { return this.wrapper.find(".active"); },
                    set: function (elem) {
                        this.wrapper.find(".active").removeClass("active");
                        $(elem).addClass("active");
                    }
                }
            });

            this.active = this.items.first();
        }
    }

    return {
        init: function (id, options, callback) {

            var slideshowContainer = $("#" + id);

            if (! slideshowContainer.hasClass(".js-slideshow-active")) {

                this.options = {
                    startSlide: 0,
                    speed: 300,
                    continuous: true,
                    disableScroll: false
                };

                // Setup user-defined options
                if (typeof options === "object" && typeof options !== "undefined") {

                    for (var key in options) {
                        this.options[key] = options[key];
                    }
                }

                // setup Swipe
                var slideshow = new Swipe(document.getElementById(id), this.options);

                // setup dots
                var dots = new SwipeDots(slideshow.length);
                dots.wrapper.insertAfter(slideshow.container);

                // Taps on individual dots go to their corresponding slide
                slideshowContainer.next().on("click", function (event) {

                    var target  = event.target;

                    dots.items.each(function (index, item) {

                        if (item === target) {
                            slideshow.slide(index, 300);
                        }
                    });
                });

                // setup dots callback
                slideshow.callback = function (index, item) {

                    dots.active = dots.items[index];

                    // Download images on demand when they have a data-src and .js-slideshow-media
                    var img = $(item).find(".js-slideshow-media");

                    if (img.length > 0) {
                        var url = img.data("src");
                        img.css('background-image', 'url(' + url + ')');
                    }

                    if ($.isFunction(callback)) {
                        callback(index, item);
                    }
                };

                slideshowContainer.on("click", function (event) {

                    var target = $(event.target),
                        isNext = target.parents(".action-slideshow-next"),
                        isPrev = target.parents(".action-slideshow-prev");

                    if (isNext.length > 0) {
                        slideshow.next();
                    }

                    if (isPrev.length > 0) {
                        slideshow.prev();
                    }
                });

                slideshowContainer.addClass("js-slideshow-active");

                return slideshow;
            }
        }
    };

})();
