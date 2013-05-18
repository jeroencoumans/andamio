/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $, Swipe */

Andamio.slideshow = (function () {

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

    function Slideshow(id, params, callback) {

        var self = this;

        this.options = {
            callback: function (index, item) {

                self.dots.active = self.dots.items[index];

                if ($.isFunction(callback)) {
                    callback(index, item);
                }
            }
        };

        $.extend(this.options, params);

        this.id = id;
        this.wrapper = $("#" + id);
        this.slideshow = new Swipe(document.getElementById(id), this.options);
        this.dots = new SwipeDots(this.slideshow.getNumSlides());

        this.dots.wrapper
            .insertAfter(self.wrapper)
            .on("click", function (event) {
                var target = event.target;

                self.dots.items.each(function (index, item) {

                    if (item === target) {
                        self.slideshow.slide(index, 300);
                    }
                });
            });

        // preload images
        this.wrapper.find(".js-slideshow-media").each(function (index, item) {

            var img = $(item),
                url = img.data("src");
            img.css('background-image', 'url(' + url + ')');
        });

        this.wrapper.find(".action-slideshow-next").on("click", this.slideshow.next);
        this.wrapper.find(".action-slideshow-prev").on("click", this.slideshow.prev);
    }

    Slideshow.prototype.destroy = function () {

        this.slideshow.kill();
        this.dots.wrapper.off("click").remove();

        // needs to go last
        this.wrapper.find(".action-slideshow-next").off("click", this.slideshow.next);
        this.wrapper.find(".action-slideshow-prev").off("click", this.slideshow.prev);
        this.wrapper.find(".slideshow-container").css("width", "");
    };

    return {

        init: function (id, params, callback) {

            if ($("#" + id).find(".slideshow-item").length > 1)
                return new Slideshow(id, params, callback);
        }
    };

})();
