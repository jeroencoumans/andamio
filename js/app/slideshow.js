/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $, Swipe */

Andamio.slideshow = (function () {

    var slideshow,
        slideshowEl,
        dots,
        options;

    function SwipeDots(number) {
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

    return {

        destroy: function () {

            slideshow.kill();
            slideshow = null;
            dots.wrapper.off("click").remove();
            dots = null;

            // needs to go last
            slideshowEl.removeClass("js-slideshow-active").off("click").find(".slideshow-container").css("width", "");
        },

        init: function (id, params, callback) {

            slideshowEl = $("#" + id);

            // don't initialize the same element twice
            if (slideshowEl.hasClass("js-slideshow-active")) return;

            slideshowEl.addClass("js-slideshow-active");

            // just use swipe.js defaults
            options = {
                callback: function (index, item) {

                    dots.active = dots.items[index];

                    if ($.isFunction(callback)) {
                        callback(index, item);
                    }
                }
            };

            $.extend(options, params);

            // setup Swipe
            slideshow = this.slideshow = new Swipe(document.getElementById(id), options);
            dots = new SwipeDots(slideshow.getNumSlides());

            dots.wrapper
                .insertAfter(slideshowEl)
                .on("click", function (event) {

                var target = event.target;

                dots.items.each(function (index, item) {

                    if (item === target) {
                        slideshow.slide(index, 300);
                    }
                });
            });

            // preload images
            slideshowEl.find(".js-slideshow-media").each(function (index, item) {

                var img = $(item),
                    url = img.data("src");
                img.css('background-image', 'url(' + url + ')');
            });


            // setup event handlers
            slideshowEl.on("click", function (event) {

                var target = $(event.target),
                    isNext = target.parents(".action-slideshow-next"),
                    isPrev = target.parents(".action-slideshow-prev");

                if (isNext.length) {
                    slideshow.next();
                }

                if (isPrev.length) {
                    slideshow.prev();
                }
            });

            return this;
        }
    };

})();
