/*jshint latedef:true, undef:true, unused:true boss:true */
/*global APP, $ */

/**
 * Module for handling views
 * @author Jeroen Coumans
 * @class views
 * @namespace APP
 */
APP.views = (function () {

    var _views;

    function setupViews() {

        // view constructor
        function View(container, content, title, position) {
            this.container = container;
            this.content = content;
            this.title = title;
            if (APP.config.webapp) this.container.addClass(position);
        }

        View.prototype.slideInFromLeft = function(url, title) {
            setCurrentView(this);

            if (url) loadPage(url);
            if (title) this.title.html(title);

            this.container.addClass("slide-in-from-left").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-default").removeClass("slide-left slide-in-from-left");
            });
        };

        View.prototype.slideInFromRight = function(url, title) {
            setCurrentView(this);

            if (url) loadPage(url);
            if (title) this.title.html(title);

            this.container.addClass("slide-in-from-right").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-default").removeClass("slide-right slide-in-from-right");
            });
        };

        View.prototype.slideInFromBottom = function(url, title) {
            setCurrentView(this);

            if (url) loadPage(url);
            if (title) this.title.html(title);

            this.container.addClass("slide-in-from-bottom").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-default").removeClass("slide-bottom slide-in-from-bottom");
            });
        };

        View.prototype.slideOutToLeft = function() {
            this.container.addClass("slide-out-to-left").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-left").removeClass("slide-default slide-out-to-left");
            });
        };

        View.prototype.slideOutToRight = function() {
            this.container.addClass("slide-out-to-right").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-right").removeClass("slide-default slide-out-to-right");
            });
        };

        View.prototype.slideOutToBottom = function() {
            setCurrentView(_views.previous);

            this.container.addClass("slide-out-to-bottom").one("webkitTransitionEnd", function () {
                $(this).addClass("slide-bottom").removeClass("slide-default slide-out-to-bottom");
            });
        };

        View.prototype.show = function(url) {
            setCurrentView(this);

            if (url) loadPage(url);
            this.container.removeClass("view-hidden").addClass("view-active");
        };

        View.prototype.hide = function() {

            this.container.addClass("view-hidden").removeClass("view-active");
        };

        // setup our internal views object
        _views = {
            parentView: new View(APP.dom.parentView, APP.dom.parentViewContent, APP.dom.parentViewTitle, "slide-default"),
            childView: new View(APP.dom.childView, APP.dom.childViewContent, APP.dom.childViewTitle, "slide-right"),
            childViewAlt: new View(APP.dom.childViewAlt, APP.dom.childViewAltContent, APP.dom.childViewAltTitle, "slide-right"),
            modalView: new View(APP.dom.modalView, APP.dom.modalViewContent, APP.dom.modalViewTitle, "slide-bottom"),
            current: null,
            previous: null,
            childCount: 0,
            urlHistory: []
        };

        _views.current = _views.parentView;
    }

    /**
     * Set the current view and store the previous one
     * @private
     */
    function setCurrentView(view) {

        if (view) {
            _views.previous = _views.current;
            _views.current = view;
        }
    }

    function pushHistory(url) {

        _views.urlHistory.push(url);
    }

    function popHistory(url) {

        _views.urlHistory.pop(url);
    }

    function replaceHistory(url) {

        if (_views.urlHistory.length > 0) _views.urlHistory[_views.urlHistory.length -1] = url;
    }


    /**
     * Do an AJAX request and insert it into a view. This method also maintains the URL's for each view
     * @method page
     * @param {String} url the URL to call
     * @param {Object} view what page to insert the content int (child, parent or modal)
     */
    function loadPage(url, view, expiration) {

        if (! url) return;

        APP.dom.doc.trigger("APP:views:loadPage:start", url);

        var target = view || _views.current,
            scrollPosition = target.content.get(0).scrollTop,
            cachedUrl = APP.config.offline ? APP.store.getCache(url) : false;

        target.content.empty();

        function insertIntoView(data) {

            target.content.html(data);
            target.url = url;
            replaceHistory(url);

            if (scrollPosition > 10) {
                $.scrollElement(target.content.get(0), 0);
            }

            APP.dom.doc.trigger("APP:views:loadPage:finish", url);
        }

        if (cachedUrl) {

            insertIntoView(cachedUrl);
        } else {

            $.ajax({
                url: url,
                timeout: 10000,
                headers: { "X-PJAX": true },
                success: function(response) {

                    var minutes = expiration || 24 * 60; // lscache sets expiration in minutes, so this is 24 hours

                    if (APP.config.offline) APP.store.setCache(url, response, minutes);
                    insertIntoView(response);
                }
            });
        }
    }


    /**
     * Reloads the current page
     * @method refresh
     * @param {Object} [view] the view that should be refreshed
     */
    function reloadPage(view) {

        APP.dom.doc.trigger("APP:views:reloadPage:start");

        var targetView = view || _views.current;

        if (APP.config.offline) APP.store.deleteCache(targetView.url); // remove current cache entry

        loadPage(targetView.url, targetView);
        APP.dom.doc.trigger("APP:views:reloadPage:finish");
    }

    function pushChild(url, title) {

        APP.dom.doc.trigger("APP:views:pushChild:start");

        if (url) pushHistory(url);

        if (APP.config.webapp) {

            // disable events while we're transitioning
            APP.events.lock(300);

            switch(_views.current) {
                case _views.parentView:

                    _views.parentView.slideOutToLeft();
                    _views.childView.slideInFromRight(url, title);
                break;

                case _views.childView:

                    // make sure childViewAlt is positioned on the right
                    APP.dom.childViewAlt.removeClass("slide-left").addClass("slide-right");

                    APP.delay(function() {
                        _views.childView.slideOutToLeft();
                        _views.childViewAlt.slideInFromRight(url, title);
                    }, 0);
                break;

                case _views.childViewAlt:

                    // make sure childView is positioned on the right
                    APP.dom.childView.removeClass("slide-left").addClass("slide-right");

                    APP.delay(function() {
                        _views.childView.slideInFromRight(url, title);
                        _views.childViewAlt.slideOutToLeft();
                    }, 0);
                break;

                default:
                break;
            }

            _views.childCount++;

        } else {
            _views.parentView.hide();
            _views.childView.show(url);
        }

        APP.dom.doc.trigger("APP:views:pushChild:finish");
    }

    function popChild(url, title) {

        APP.dom.doc.trigger("APP:views:popChild:start");

        popHistory(_views.urlHistory[_views.urlHistory.length - 1]);
        url = url || _views.urlHistory[_views.urlHistory.length - 1];

        if (APP.config.webapp) {

            // disable events while we're transitioning
            APP.events.lock(300);

            switch(_views.current) {
                case _views.childView:

                    if (_views.childCount === 1) {
                        _views.parentView.slideInFromLeft(url, title);
                        _views.childView.slideOutToRight();
                    } else {

                        // make sure childView is positioned on the right
                        APP.dom.childViewAlt.removeClass("slide-right").addClass("slide-left");

                        APP.delay(function() {
                            _views.childView.slideOutToRight();
                            _views.childViewAlt.slideInFromLeft(url, title);
                        }, 0);
                    }
                break;

                case _views.childViewAlt:

                    // make sure childView is positioned on the right
                    APP.dom.childView.removeClass("slide-right").addClass("slide-left");

                    APP.delay(function() {
                        _views.childView.slideInFromLeft(url, title);
                        _views.childViewAlt.slideOutToRight();
                    }, 0);
                break;

                default:
                break;
            }

            _views.childCount--;

        } else {
            _views.parentView.show(url, title);
            _views.childView.hide();
        }

        APP.dom.doc.trigger("APP:views:popChild:finish");
    }

    function pushModal(url, title) {

        if (_views.current === _views.modalView) return; // modal is already open

        APP.dom.doc.trigger("APP:views:pushModal:start");

        APP.dom.html.addClass("has-modalview");

        if (APP.config.webapp) {

            _views.modalView.slideInFromBottom(url, title);

        } else {

            _views.current.hide();
            _views.modalView.show(url, title);
        }

        APP.dom.doc.trigger("APP:views:pushModal:finish");
    }

    function popModal(url, title) {

        if (_views.current !== _views.modalView) return; // modal is not open

        APP.dom.doc.trigger("APP:views:popModal:start");

        APP.dom.html.removeClass("has-modalview");

        if (APP.config.webapp) {

            _views.modalView.slideOutToBottom();
        } else {

            _views.previous.show(url, title);
            _views.modalView.hide();
        }

        APP.dom.doc.trigger("APP:views:popModal:finish");
    }

    function openParentPage(url) {

        APP.dom.doc.trigger("APP:views:openParentPage:start");

        if (APP.config.webapp) {
            APP.dom.parentView.removeClass("slide-left slide-right").addClass("slide-default");
            APP.dom.childView.removeClass("slide-left slide-default").addClass("slide-right");
            APP.dom.childViewAlt.removeClass("slide-left slide-default").addClass("slide-right");
        }

        _views.urlHistory = [];
        loadPage(url, _views.parentView);

        APP.dom.doc.trigger("APP:views:openParentPage:finish");
    }

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Open child page
        APP.events.attachClickHandler(".action-push", function (event) {

            var target = $(event.target).closest(".action-push"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            pushChild(url, title);
        });

        // Open parent page
        APP.events.attachClickHandler(".action-pop", function () {

            popChild();
        });

        // Open modal
        APP.events.attachClickHandler(".action-show-modal", function (event) {

            var target = $(event.target).closest(".action-show-modal"),
                title = APP.util.getTitle(target),
                url = APP.util.getUrl(target);

            pushModal(url, title);
        });

        // Close modal
        APP.events.attachClickHandler(".action-hide-modal", function () {

            popModal();
        });

        // Refresh
        APP.events.attachClickHandler(".action-refresh", function () {

            if (APP.alert.status) APP.alert.hide();
            reloadPage();
        });
    }

    /***
     * Initialize variables and attach listeners
     * @method init
     */
    function init() {

        setupViews();
        attachListeners();
    }

    return {
        "init": init,
        "pushChild": pushChild,
        "popChild": popChild,
        "pushModal": pushModal,
        "popModal": popModal,
        "openParentPage": openParentPage,
        "loadPage": loadPage,
        "reloadPage": reloadPage,
        "list": function() { return _views; },
        "current": function() { return _views.current; }
    };
})();