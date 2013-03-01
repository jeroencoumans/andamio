/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global $, Andamio */

window.Andamio = {};

Andamio.dom = (function () {

    return {
        win:            $(window),
        doc:            $(window.document),
        html:           $("html"),
        viewport:       $(".viewport"),

        pageView:       $(".js-page-view"),
        parentView:     $(".js-parent-view"),
        childView:      $(".js-child-view"),
        childViewAlt:   $(".js-child-view-alternate"),
        modalView:      $(".js-modal-view")
    };
})();
