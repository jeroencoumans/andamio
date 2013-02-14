/*jshint latedef:true, undef:true, unused:true boss:true */
/*global APP, $ */

/**
 * Module for handling views
 * @author Jeroen Coumans
 * @class views
 * @namespace APP
 */
APP.views = (function () {

    function Elems(container) {
        this.container = container;

        this.__defineGetter__("title", function() {
            return this.container.find(".js-title");
        });

        this.__defineGetter__("content", function() {
            var content = this.container.hasClass("js-content") ? this.container : this.container.find(".js-content");
            return content;
        });

        this.__defineGetter__("scroller", function() {
            var scroller = this.container.hasClass("overthrow") ? this.container : this.container.find(".overthrow");
            return scroller;
        });
    }

    /**
     * Views constructor
     * @param container {HTMLElement} container element that will be toggled or animated
     * @param position {String} default position of the element, one of "slide-left", "slide-right", "slide-bottom" or "slide-default"
     */
    function View(container, position) {
        this.elems = new Elems(container);

        if (position) {
            // Store the initial position
            this.initialPosition = position;
            this.position = position;

            /**
             * Slide the view based on the current position and the desired direction. Used only in webapp.
             * @method slide
             * @param direction {String} direction to which the view should slide
             */
            this.slide = function(direction) {
                var container = this.elems.container,
                    position = this.position;

                // Slide in from the left
                if (position === "slide-left" && direction === "slide-default") {
                    container.addClass("slide-in-from-left").one("webkitTransitionEnd", function () {
                        container.addClass("slide-default").removeClass("slide-left slide-right slide-in-from-left");
                    });
                }

                // Slide in from the right
                if (position === "slide-right" && direction === "slide-default") {
                    container.addClass("slide-in-from-right").one("webkitTransitionEnd", function () {
                        container.addClass("slide-default").removeClass("slide-right slide-left slide-in-from-right");
                    });
                }

                // Slide in from the bottom
                if (position === "slide-bottom" && direction === "slide-default") {
                    container.addClass("slide-in-from-bottom").one("webkitTransitionEnd", function () {
                        container.addClass("slide-default").removeClass("slide-bottom slide-in-from-bottom");
                    });
                }

                // Slide in from the top
                if (position === "slide-top" && direction === "slide-default") {
                    container.addClass("slide-in-from-top").one("webkitTransitionEnd", function () {
                        container.addClass("slide-default").removeClass("slide-top slide-in-from-top");
                    });
                }

                // Slide out to the left
                if (position === "slide-default" && direction === "slide-left") {
                    container.addClass("slide-out-to-left").one("webkitTransitionEnd", function () {
                        container.addClass("slide-left").removeClass("slide-default slide-out-to-left");
                    });
                }

                // Slide out to the right
                if (position === "slide-default" && direction === "slide-right") {
                    container.addClass("slide-out-to-right").one("webkitTransitionEnd", function () {
                        container.addClass("slide-right").removeClass("slide-default slide-out-to-right");
                    });
                }

                // Slide out to the bottom
                if (position === "slide-default" && direction === "slide-bottom") {
                    container.addClass("slide-out-to-bottom").one("webkitTransitionEnd", function () {
                        container.addClass("slide-bottom").removeClass("slide-default slide-out-to-bottom");
                    });
                }

                // Slide out to the top
                if (position === "slide-default" && direction === "slide-top") {
                    container.addClass("slide-out-to-top").one("webkitTransitionEnd", function () {
                        container.addClass("slide-top").removeClass("slide-default slide-out-to-top");
                    });
                }

                // update positions
                this.position = direction;
            };
        }

        /**
         * Returns the content from url, storing it when it's not stored yet
         * @method getContent
         * @param url {String} URL to load
         * @param expiration {Integer} how long (in minutes) the content can be cached when retrieving
         * @param callback {Function} callback function that receives the content
         */
        this.getContent = function(url, expiration, callback) {

            if (! url) return;

            // try to get the cached content first
            var cachedContent = APP.store.getCache(url);

            if (cachedContent) {

                if ($.isFunction(callback)) callback(cachedContent);
            } else {

                // Add cachebuster
                var requestUrl = url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();

                $.ajax({
                    "url": requestUrl,
                    "timeout": 10000,
                    "headers": { "X-PJAX": true, "X-Requested-With": "XMLHttpRequest" },
                    success: function(response) {

                        var minutes = expiration || 24 * 60; // lscache sets expiration in minutes, so this is 24 hours
                        if (APP.config.offline) APP.store.setCache(url, response, minutes);
                    },
                    complete: function(data) {
                        if ($.isFunction(callback)) callback(data.responseText);
                    }
                });
            }
        };

        /**
         * Inserts the content and sets the view to active
         * @method load
         * @param url {String} the URL to show
         * @param expiration {Integer} how long (in minutes) the content can be cached when retrieving
         * @param callback {Function}
         */
        this.load = function(url, expiration, callback) {

            if (! url) return false;

            APP.dom.doc.trigger("APP:views:loadPage:start", url);

            var content = this.elems.content;

            // First empty the content
            content.empty();

            // Insert the new content
            this.getContent(url, expiration, function(response) {
                content.html(response);

                APP.dom.doc.trigger("APP:views:loadPage:finish", url);
                if ($.isFunction(callback)) callback();
            });
        };

        /**
         * Sets the view to active
         */
        this.show = function(scrollPosition) {

            var container = this.elems.container,
                scroller = this.elems.scroller;

            container.removeClass("view-hidden").addClass("view-active");

            if (typeof scrollPosition === "number" && scroller.length > 0) {

                var currentScrollPosition = scroller[0].scrollTop;

                if (currentScrollPosition !== scrollPosition) {
                    scroller[0].scrollTop = scrollPosition;
                }
            }
        };

        /**
         * Sets the view to inactive
         */
        this.hide = function() {

            this.elems.container.removeClass("view-active").addClass("view-hidden");
        };

        /**
         * Resets the view to its original state
         */
        this.reset = function() {

            if (this.position && APP.config.webapp) {
                this.position = this.initialPosition;
                this.elems.container
                    .removeClass("slide-left")
                    .removeClass("slide-right")
                    .removeClass("slide-default")
                    .removeClass("slide-bottom")
                    .addClass(this.position);
            }

            this.elems.container.removeClass("view-active").addClass("view-hidden");
        };
    }

    /**
     * Constructor for our views collection
     */
    function ViewsCollection() {
        this.views = {
            parentView:     new View(APP.dom.parentView, "slide-default"),
            childView:      new View(APP.dom.childView, "slide-right"),
            modalView:      new View(APP.dom.modalView, "slide-bottom")
        };

        this.childCount = 0;
        this.modalCount = 0;

        // Some convenient arrays for storing the URL, view and scroll position
        var urlHistory = [];
        var viewHistory = [];
        var scrollHistory = [];

        this._urlHistory = function()    { return urlHistory; };
        this._viewHistory = function()   { return viewHistory; };
        this._scrollHistory = function() { return scrollHistory; };

        // For 2-page apps, use the fastPath
        var fastPath = true;

        /**
         * Get the current URL
         */
        this.__defineGetter__("currentUrl", function() {

            if (urlHistory.length > 0)
                return urlHistory[urlHistory.length -1];
        });

        /**
         * Set the current URL
         * @param url {String} the new URL
         */
        this.__defineSetter__("currentUrl", function(url) {

            // only store unique URL's
            if (url !== this.url)
                urlHistory.push(url);
        });

        /**
         * Get the previous URL
         */
        this.__defineGetter__("previousUrl", function() {

            if (urlHistory.length > 1)
                return urlHistory[urlHistory.length -2];
        });

        /**
         * Method for the replacing the current URL with a new URL
         * @method replaceUrl
         * @param url {String} the new URL
         */
        this.replaceUrl = function(url) {

            if (urlHistory.length > 0)
                urlHistory[urlHistory.length -1] = url;
        };

        /**
         * Set current view
         */
        this.__defineSetter__("currentView", function(view) {

            viewHistory.push(view);
        });

        /**
         * Get current view, if available
         */
        this.__defineGetter__("currentView", function() {

            if (viewHistory.length > 0) {
                return viewHistory[viewHistory.length - 1];
            }
        });

        /**
         * Gets previous view
         */
        this.__defineGetter__("previousView", function() {

            if (viewHistory.length > 1)
                return viewHistory[viewHistory.length - 2];
        });

        /**
         * Gets current scroll position
         */
        this.__defineGetter__("scrollPosition", function() {

            if (scrollHistory.length > 0)
                return scrollHistory[scrollHistory.length -1];
        });

        /**
         * Sets current scroll position
         */
        this.__defineSetter__("scrollPosition", function(scrollPosition) {

            scrollHistory.push(scrollPosition);
        });

        /**
         * Set a new view, load the content and show it
         * @param view {String} view to push, can be parentView, childView, modalView
         * @param url {String} the URL to load
         */
        this.addView = function(view, url) {

            if (! view) return false;
            var views = this.views,
                target;

            // Search the views collection for the name of the passed view and store it
            for (var v in views) {
                if (v === view) target = views[v];
            }

            // The passed view isn't available, bailing
            if (! target) return;

            // Set the current view to the new view
            this.currentView = target;
            if (url) this.currentUrl = url;

            // Store the previous scrollPosition
            if (this.previousView) {
                this.scrollPosition = this.previousView.elems.scroller[0].scrollTop;
            }

            // Show the new view
            if (url) this.currentView.load(url);
            this.currentView.show(0);

            if (this.childCount > 1) fastPath = false;
        };

        /**
         * Hide view
         * @param view {String} view to hide, can be parentView, childView, modalView
         */
        this.hideView = function(view) {
            var views = this.views,
                target;

            for (var v in views) {
                if (v === view) {
                    target = views[v];
                }
            }

            if (! target) return;

            target.hide();
        };

        /**
         * Deletes current view and restore the previous view
         **/
        this.deleteView = function() {

            var previousView = this.previousView,
                scrollPosition = this.scrollPosition,
                previousUrl = this.previousUrl;

            if (! previousView) return false; // we're already at the last visible view

            // hide current
            this.currentView.hide();

            // Fast path: last view is still in the DOM, so just show it
            if (fastPath) {

                previousView.show();

            } else {

                // Show previous view with the previous URL
                previousView.load(previousUrl, null, function() {

                    previousView.show(scrollPosition);
                });
            }

            // Delete the last view
            viewHistory.pop();
            urlHistory.pop();
            scrollHistory.pop();

            if (this.childCount === 0) fastPath = true;
        };

        /**
         * Resets all history and views
         */
        this.reset = function() {

            for (var view in this.views) {
                this.views[view].reset();
            }

            viewHistory = [];
            urlHistory = [];
            scrollHistory = [];
            fastPath = true;
        };
    }

    // Setup our views
    var collection = new ViewsCollection();

    /**
     * Main interface for adding a new child view
     * @param url {String} URL to show in the child view
     */
    function pushChild(url) {

        collection.childCount++;

        if (collection.childCount % 2 > 0) {

            if (APP.config.webapp) {
                APP.dom.childView.removeClass("slide-left").addClass("slide-right");

                APP.delay(function() {
                    collection.views.parentView.slide("slide-left");
                    collection.views.childView.slide("slide-default");
                }, 0);
            }

            collection.hideView("parentView");
            collection.addView("childView", url, 0);

        } else {

            if (APP.config.webapp) {
                APP.dom.parentView.removeClass("slide-left").addClass("slide-right");

                APP.delay(function() {
                    collection.views.parentView.slide("slide-default");
                    collection.views.childView.slide("slide-left");
                }, 0);
            }

            collection.hideView("childView");
            collection.addView("parentView", url, 0);
        }
    }

    /**
     * Main interface for removing a child view
     */
    function popChild() {

        if (collection.childCount % 2 > 0) {

            if (APP.config.webapp) {

                APP.dom.parentView.removeClass("slide-right").addClass("slide-left");

                APP.delay(function() {
                    collection.views.parentView.slide("slide-default");
                    collection.views.childView.slide("slide-right");
                }, 0);
            }

            collection.deleteView("parentView");

        } else {

            if (APP.config.webapp) {

                APP.dom.childView.removeClass("slide-right").addClass("slide-left");

                APP.delay(function() {
                    collection.views.childView.slide("slide-default");
                    collection.views.parentView.slide("slide-right");
                }, 0);
            }

            collection.deleteView("childView");
        }

        collection.childCount--;
    }

    /**
     * Main interface for adding a modal view
     * @param url {String} URL to show in the view
     */
    function pushModal(url) {

        if (collection.modalCount > 0) {
            return false;
        } else {

            if (APP.config.webapp) {
                collection.views.modalView.slide("slide-default");
            } else {
                collection.hideView("parentView");
            }

            collection.addView("modalView", url);
            collection.modalCount++;
        }
    }

    /**
     * Main interface for adding a new child view
     */
    function popModal() {

        if (collection.modalCount > 0) {

            if (APP.config.webapp) {
                collection.views.modalView.slide("slide-bottom");
            }

            collection.deleteView("modalView");
            collection.modalCount--;
        } else {
            return false;
        }
    }

    /**
     * Shortcut for opening a parent page
     * Resets url & view history
     */
    function openParentPage(url) {

        collection.reset();

        collection.addView("parentView", url);

        var scroller = collection.views.parentView.elems.scroller;

        if (scroller.length > 0) {
            scroller[0].scrollTop = 0;
        }
    }

    /**
     * Loads a page in the current view
     */
    function loadPage(url) {
        if (url) {
            collection.replaceUrl(url);
            collection.currentView.load(url);
            collection.currentView.show(0);
        }
    }

    /**
     * Reloads the current page
     * @method refresh
     */
    function reloadPage() {

        APP.dom.doc.trigger("APP:views:reloadPage:start");

        var view = collection.currentView,
            url = collection.currentUrl;

        // remove current cache entry
        if (APP.config.offline) APP.store.deleteCache(url);

        view.load(url);
        APP.dom.doc.trigger("APP:views:reloadPage:finish");
    }

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        // Open child page
        APP.events.attachClickHandler(".action-push", function (event) {

            var target = $(event.currentTarget),
                url = APP.util.getUrl(target);

            pushChild(url);
        });

        // Open parent page
        APP.events.attachClickHandler(".action-pop", function () {
            popChild();
        });

        // Open modal
        APP.events.attachClickHandler(".action-show-modal", function (event) {

            var target = $(event.currentTarget),
                url = APP.util.getUrl(target);

            pushModal(url);
        });

        // Close modal
        APP.events.attachClickHandler(".action-hide-modal", function () {
            popModal();
        });

        // Refresh
        APP.events.attachClickHandler(".action-refresh", function () {
            reloadPage();
        });
    }

    /***
     * Initialize variables and attach listeners
     * @method init
     */
    function init() {

        attachListeners();

        // Set our views to the initial state
        collection.reset();
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
        "collection": collection,
        "View": View
    };
})();
