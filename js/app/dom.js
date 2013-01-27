var APP = APP || {};

APP.config = {
    server: "http://localhost"
}

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

        // page wrapper
        pageView = $("#page-view"),

        // parent view
        parentView = $("#parent-view"),
        parentViewTitle = parentView.find(".js-title"),
        parentViewContent = parentView.find(".js-content"),

        // child view
        childView = $("#child-view"),
        childViewTitle = childView.find(".js-title"),
        childViewContent = childView.find(".js-content"),

        // alternate child view
        childViewAlt = $("#child-view-alternate"),
        childViewAltTitle = childViewAlt.find(".js-title"),
        childViewAltContent = childViewAlt.find(".js-content"),

        // modal view
        modalView = $("#modal-view"),
        modalViewTitle = modalView.find(".js-title"),
        modalViewContent = modalView.find(".js-content"),

        // navigation
        pageNav = $("#page-navigation"),
        pageNavItems = pageNav.find(".action-nav-item"),
        pageNavActive = pageNavItems.filter(".active"),

        // loader
        pageLoader = $("#loader"),
        pageLoaderImg = pageLoader.find("img"),

        // tabs
        pageTabs = $("#page-tabs"),
        pageTabItems = pageTabs.find(".action-tab-item"),
        pageTabActive = pageTabItems.filter(".active"),

        // alert
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
        childViewAlt: childViewAlt,
        childViewAltTitle: childViewAltTitle,
        childViewAltContent: childViewAltContent,
        modalView: modalView,
        modalViewTitle: modalViewTitle,
        modalViewContent: modalViewContent,
        pageNav: pageNav,
        pageNavItems: pageNavItems,
        pageNavActive: pageNavActive,
        pageLoader: pageLoader,
        pageLoaderImg: pageLoaderImg,
        pageTabs: pageTabs,
        pageTabItems: pageTabItems,
        pageTabActive: pageTabActive,
        pageAlert: pageAlert
    };

})();
