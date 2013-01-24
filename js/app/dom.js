var APP = APP || {};

/**
 * Module for accessing all Andamio DOM elements
 * @author Jeroen Coumans
 * @class dom
 * @namespace APP
 */
APP.dom = (function () {

    var doc = $(document),
        html = $("html"),
        viewport = $(".viewport"),
        pageView = $("#page-view"),
        parentView = $("#parent-view"),
        childView = $("#child-view"),
        modalView = $("#modal-view"),
        pageNav = $("#page-navigation"),
        pageNavItems = pageNav.find(".action-nav-item"),
        pageNavActive = pageNavItems.filter(".active"),
        pageLoader = $("#loader"),
        pageTabs = $("#page-tabs"),
        pageTabItems = pageTabs.find(".action-tab-item"),
        pageTabActive = pageTabs.find(".active"),
        pageAlert = $("#page-alert");

    return {
        doc: doc,
        html: html,
        viewport: viewport,
        pageView: pageView,
        parentView: parentView,
        childView: childView,
        modalView: modalView,
        pageNav: pageNav,
        pageNavItems: pageNavItems,
        pageNavActive: pageNavActive,
        pageLoader: pageLoader,
        pageTabs: pageTabs,
        pageTabItems: pageTabItems,
        pageTabActive: pageTabActive,
        pageAlert: pageAlert
    };

})();
