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
        parentViewTitle = parentView.find(".js-title"),
        parentViewContent = parentView.find(".js-content"),
        childView = $("#child-view"),
        childViewTitle = childView.find(".js-title"),
        childViewContent = childView.find(".js-content"),
        modalView = $("#modal-view"),
        modalViewTitle = modalView.find(".js-title"),
        modalViewContent = modalView.find(".js-content"),
        pageNav = $("#page-navigation"),
        pageNavItems = pageNav.find(".action-nav-item"),
        pageNavActive = pageNavItems.filter(".active"),
        pageLoader = $("#loader"),
        pageTabs = $("#page-tabs"),
        pageTabItems = pageTabs.find(".action-tab-item"),
        pageTabActive = pageTabItems.filter(".active"),
        pageAlert = $("#page-alert");

    return {
        doc: doc,
        html: html,
        viewport: viewport,
        pageView: pageView,
        parentView: parentView,
        parentViewTitle: parentViewTitle,
        parentViewContent: parentViewContent,
        childView: childView,
        childViewTitle: childViewTitle,
        childViewContent: childViewContent,
        modalView: modalView,
        modalViewTitle: modalViewTitle,
        modalViewContent: modalViewContent,
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
