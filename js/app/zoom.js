/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio */

Andamio.zoom = (function () {

    function Zoom(container) {

        if (! container.length) throw "container must be a Zepto collection with class .zoom-container";

        this.container = container;

        // Start it up
        this.enable();
    }

    Zoom.prototype = {

        onTouchStart: function (e) {

            console.log(e);
        },

        onTouchMove: function (e) {

            if (e.touches.length === 2) {

                // do zoom magic
            }

        },

        onTouchEnd: function (e) {

            console.log(e);
        },

        enable: function () {

            this.container.on("touchstart", this.onTouchStart);
            this.container.on("touchmove",  this.onTouchMove);
            this.container.on("touchend",   this.onTouchEnd);
        },

        disable: function () {

            this.container.off("touchstart", this.onTouchStart);
            this.container.off("touchmove",  this.onTouchMove);
            this.container.off("touchend",   this.onTouchEnd);
        }
    };

    var zoomCollection = {};

    return {

        get collection() {
            return zoomCollection;
        },

        add: function (name, collection) {

            zoomCollection[name] = new Zoom(collection);
        },

        destroy: function (name) {

            zoomCollection[name].destroy();
            delete zoomCollection[name];
        }
    };

})();
