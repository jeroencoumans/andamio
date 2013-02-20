/*jshint es5: true, browser: true */
/*global $, Andamio */

window.Andamio = {};

Andamio.dom = (function () {

    "use strict";

    return {
        win:        window,
        doc:        $(window.document),
        html:       $("html"),
        viewport:   $(".viewport"),

        pageView:   $(".js-page-view"),
        parentView: $(".js-parent-view"),
        childView:  $(".js-child-view"),
        modalView:  $(".js-modal-view")
    };
})();
