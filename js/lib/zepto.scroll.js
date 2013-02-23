// https://github.com/suprMax/ZeptoScroll/blob/master/static/zepto.scroll.js
// refactored a bit to support arbitrary element scrolling
;(function($) {
    var interpolate = function (source, target, shift) {
        return (source + (target - source) * shift);
    };

    var easing = function (pos) {
        return (-Math.cos(pos * Math.PI) / 2) + 0.5;
    };

    $.scroll = function(endY, duration, easingF) {
        var element = document.body;
        $.scrollElement(element, endY, duration, easingF);
    };

    $.scrollElement = function(element, endY, duration, easingF) {
        endY = endY || (Andamio.config.os.android ? 1 : 0);
        duration = duration || 400;
        (typeof easingF === 'function') && (easing = easingF);
        var startY = element.scrollTop,
            startT  = Date.now(),
            finishT = startT + duration;

        var animate = function() {
            var now = +(new Date()),
                shift = (now > finishT) ? 1 : (now - startT) / duration;

            element.scrollTop = interpolate(startY, endY, easing(shift));

            (now > finishT) || setTimeout(animate, 15);
        };

        animate();
    };
}(Zepto));
