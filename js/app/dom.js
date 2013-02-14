/*jshint latedef:true, undef:true, unused:false boss:true */
/*global $, window */

var APP = APP || {};


/**
 * Module for accessing all Andamio DOM elements
 * @author Jeroen Coumans
 * @class dom
 * @namespace APP
 */
APP.dom = (function () {

    var doc = $(window.document),
        html = $("html"),
        viewport = $(".viewport"),

        // page wrapper
        pageView = $("#page-view"),

        // parent view
        parentView = $("#parent-view"),

        // child view
        childView = $("#child-view"),

        // modal view
        modalView = $("#modal-view"),

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
        win: window,
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
        pageLoaderImg: pageLoaderImg,
        pageTabs: pageTabs,
        pageTabItems: pageTabItems,
        pageTabActive: pageTabActive,
        pageAlert: pageAlert
    };

})();
