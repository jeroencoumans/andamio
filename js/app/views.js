/*jshint browser: true, undef:true, unused:true, indent: 4, boss:true */
/*global Andamio, $ */

// Register DOM references
Andamio.dom.pageView     = $(".js-page-view");
Andamio.dom.parentView   = $(".js-parent-view");
Andamio.dom.childView    = $(".js-child-view");
Andamio.dom.childViewAlt = $(".js-child-view-alternate");
Andamio.dom.modalView    = $(".js-modal-view");
Andamio.dom.mediaView    = $(".js-media-view");

/*** TODO: add support for data-title ***/
Andamio.views = (function () {

    "use strict";

    /**
     * A view has a container, optional content and position
     */
    function View(name, container, position) {
        this.name      = name;
        this.container = container;
        this.url       = "";

        if (position) {
            this.initialPosition = position;
            this.position = position;
        }
    }

    View.prototype = {

        /**
         * Slide the view based on the current position and the desired direction. Used only in webapp.
         * @method slide
         * @param direction {String} direction to which the view should slide
         */
        slide: function (to) {

            if (! this.position && ! this.initialPosition) return;

            var position = this.position,
                container = this.container,

                // This iif generates an object with three values
                // based on the current position and the new position.
                // These values are used to set and unset the right CSS classes when transitioning
                // e.g. "slide-default", "slide-left"
                opts = (function (from, to) {

                    var prefix = "slide-";
                    var opposites = {
                        "left"    : "right",
                        "right"   : "left",
                        "top"     : "bottom",
                        "bottom"  : "top",
                        "default" : "default"
                    };

                    // remove the prefix from our function arguments
                    from = from.substr(prefix.length, from.length);
                    to   = to.substr(prefix.length, to.length);

                    var direction = prefix + (from === "default" ? "out-to-" + to : "in-from-" + from);

                    return {
                        a: direction,                                   // "slide-out-to-left"
                        b: prefix + to,                                 // "slide-left"
                        c: direction + " " + prefix + from + " " + prefix + opposites[from]   // "slide-out-to-left slide-default"
                    };
                })(position, to);

            Andamio.events.lock();

            container.addClass(opts.a).one("webkitTransitionEnd", function () {
                container.addClass(opts.b).removeClass(opts.c);
                Andamio.events.unlock();
            });

            // update positions
            this.position = to;
        },

        /**
         * Resets the view to its original state
         */
        reset: function () {

            if (this.position && Andamio.config.webapp) {

                this.position = this.initialPosition;
                this.container
                    .removeClass("slide-left slide-right slide-default slide-bottom")
                    .addClass(this.position);
            }

            this.active = false;
            this.scrollPosition = 0;
        }
    };

    Object.defineProperties(View.prototype, {
        title: {
            configurable: true,
            get: function () {
                return this.container.find(".js-title");
            },
            set: function (value) {
                if (typeof value === "string") {
                    this.container.find(".js-title").text(value);
                }
            }
        },
        content: {
            configurable: true,
            get: function () {
                return this.container.hasClass("js-content") ? this.container : this.container.find(".js-content");
            }
        },
        scroller: {
            configurable: true,
            get: function () {
                if (Andamio.config.webapp) {
                    return this.container.hasClass("overthrow") ? this.container : this.container.find(".overthrow");
                } else {
                    return Andamio.dom.win;
                }
            }
        },
        scrollPosition: {
            get: function () {
                return Andamio.config.webapp ? this.scroller[0].scrollTop : Andamio.dom.viewport[0].scrollTop;
            },
            set: function (value) {
                if (Andamio.config.webapp && this.scroller.length) this.scroller[0].scrollTop = value;
                else Andamio.dom.viewport[0].scrollTop = value;
            }
        },
        active: {
            get: function () {
                return this.container.hasClass("view-active");
            },
            set: function (value) {
                if (value) {
                    this.container.addClass("view-active").removeClass("view-hidden");
                } else {
                    this.container.addClass("view-hidden").removeClass("view-active");
                }
            }
        },
        expiration: {
            get: function () {
                return Andamio.config.expiration[this.name] || Andamio.config.expiration.all;
            }
        }
    });

    // variables used in the returned object, defined in init()
    var parentView,
        childView,
        childViewAlt,
        modalView,
        mediaView;

    return {

        parentView   : new View("parentView",   Andamio.dom.parentView,   "slide-default"),
        childView    : new View("childView",    Andamio.dom.childView,    "slide-right"),
        childViewAlt : new View("childViewAlt", Andamio.dom.childViewAlt, "slide-right"),
        modalView    : new View("modalView",    Andamio.dom.modalView,    "slide-bottom"),
        mediaView    : new View("mediaView",    Andamio.dom.mediaView,    "slide-bottom"),

        urlHistory   : [],
        viewHistory  : [],
        scrollHistory: [],

        childCount   : 0,
        modalCount   : 0,
        mediaCount   : 0,

        get currentUrl()        { return Andamio.util.last(this.urlHistory); },
        set currentUrl(val)     { Andamio.util.addUniq(val, this.urlHistory); },

        get previousUrl()       { return Andamio.util.prev(this.urlHistory); },
        get currentView()       { return Andamio.util.last(this.viewHistory); },
        set currentView(val)    { this.viewHistory.push(val); },
        get previousView()      { return Andamio.util.prev(this.viewHistory); },

        get previousScrollPosition()    { return Andamio.util.last(this.scrollHistory); },
        set previousScrollPosition(val) { this.scrollHistory.push(val); },

        resetViews: function () {

            parentView.reset();
            childView.reset();
            childViewAlt.reset();
            modalView.reset();
            mediaView.reset();

            this.viewHistory = [];
            this.urlHistory = [];
            this.scrollHistory = [];
            this.childCount = 0;
            this.modalCount = 0;
        },

        loadView: function (view, url, scrollPosition, callback, refresh) {

            var onLoaded = function (response, errorType) {

                // we always get a response, even if there's an error
                view.content[0].innerHTML = response;
                this.currentUrl = url;
                view.url = url;

                if (typeof scrollPosition === "number" && view.scroller.length) {
                    view.scrollPosition = scrollPosition;
                }

                if (! errorType) {
                    Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [view, refresh ? "refresh" : "load", url]);
                }

                if ($.isFunction(callback)) {
                    callback();
                }
            };

            // If there are still requests pending, cancel them
            Andamio.page.abortRequest();

            view.content[0].innerHTML = "";
            Andamio.dom.doc.trigger("Andamio:views:activateView:start", [view, refresh ? "refresh" : "load", url]);

            if (refresh) {
                Andamio.page.refresh(url, view.expiration, $.proxy(onLoaded, this));
            }
            else {
                Andamio.page.load(url, view.expiration, false, $.proxy(onLoaded, this));
            }
        },

        activateView: function (view, url, scrollPosition, refresh) {

            view.active = true;
            Andamio.dom.html.addClass("has-" + view.name);

            if (url) {
                this.loadView(view, url, scrollPosition, null, refresh);
            } else {
                Andamio.dom.doc.trigger("Andamio:views:activateView:start", [view, "load", this.currentUrl]);
                Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [view, "load", this.currentUrl]);
            }
        },

        refreshView: function (view, callback) {

            view = view || this.currentView;

            if (view.url) {
                this.loadView(view, view.url, 0, callback, "refresh");
            }
        },

        deactivateView: function (view) {

            view.active = false;
            Andamio.dom.html.removeClass("has-" + view.name);
        },

        pushView: function (view, url, scrollPosition, refresh) {

            this.currentView = view;

            if (this.previousView) {
                this.previousScrollPosition = this.previousView.scrollPosition;
                this.deactivateView(this.previousView);
            }

            this.activateView(view, url, scrollPosition, refresh);
        },

        popView: function () {

            if (this.previousView) {

                // hide current
                this.deactivateView(this.currentView);

                // Delete the last view
                this.viewHistory.pop();

                // Only pop history if there's more than 1 item
                if (this.urlHistory.length > 1) {
                    this.urlHistory.pop();
                }

                // Fast path: parent view is still in the DOM, so just show it
                if (this.childCount === 1 || this.modalCount || this.mediaCount) {
                    this.activateView(this.currentView);
                } else {
                    this.activateView(this.currentView, this.currentUrl, this.previousScrollPosition);
                }

                // Finally, delete the last scroll position
                this.scrollHistory.pop();
            }
        },

        openParentPage: function (url, refresh) {

            this.resetViews();
            this.pushView(parentView, url, 0, refresh);
        },

        pushModal: function (url, refresh) {

            if (this.modalCount > 0) {
                return false;
            } else {

                if (Andamio.config.webapp) {
                    modalView.slide("slide-default");
                }

                this.pushView(modalView, url, 0, refresh);
                this.modalCount++;
            }
        },

        popModal: function () {

            if (this.modalCount > 0) {

                if (Andamio.config.webapp) {
                    modalView.slide("slide-bottom");
                }

                this.popView();
                this.modalCount--;
            } else {
                return false;
            }
        },

        pushMedia: function (url, refresh) {

            if (this.mediaCount > 0) {
                return false;
            } else {

                if (Andamio.config.webapp) {
                    mediaView.slide("slide-default");
                }

                this.pushView(mediaView, url, 0, refresh);
                this.mediaCount++;
            }
        },

        popMedia: function () {

            if (this.mediaCount > 0) {

                if (Andamio.config.webapp) {
                    mediaView.slide("slide-bottom");
                }

                this.popView();
                this.mediaCount--;
            } else {
                return false;
            }
        },

        pushChild: function (url, refresh) {

            // Don't open the same URL, instead refresh
            if (url === Andamio.views.currentUrl) {
                if (Andamio.config.webapp) {
                    $.scrollElement(this.currentView.scroller[0], 0);
                } else {
                    this.currentView.scrollPosition = 0;
                }

                return;
            }

            this.childCount++;

            switch (this.currentView) {

            // Initial situation
            case parentView:
                this.pushView(childView, url, 0, refresh);

                if (Andamio.config.webapp) {
                    parentView.slide("slide-left");
                    childView.slide("slide-default");
                }

                break;

            case childView:
                this.pushView(childViewAlt, url, 0, refresh);

                if (Andamio.config.webapp) {
                    childViewAlt.container.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function () {
                        childView.slide("slide-left");
                        childViewAlt.slide("slide-default");
                    }, 0);
                }

                break;

            case childViewAlt:
                this.pushView(childView, url, 0, refresh);

                if (Andamio.config.webapp) {
                    childView.container.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function () {
                        childViewAlt.slide("slide-left");
                        childView.slide("slide-default");
                    }, 0);
                }

                break;
            }
        },

        popChild: function () {

            var currentView = this.currentView;

            if (Andamio.config.webapp) {
                switch (currentView) {
                case parentView:
                    return; // abort!

                case childView:

                    if (this.childCount === 1) {

                        parentView.slide("slide-default");
                        childView.slide("slide-right");

                    } else {

                        childViewAlt.container.removeClass("slide-right").addClass("slide-left");

                        Andamio.util.delay(function () {
                            childView.slide("slide-right");
                            childViewAlt.slide("slide-default");
                        }, 0);
                    }

                    break;

                case childViewAlt:

                    childView.container.removeClass("slide-right").addClass("slide-left");

                    Andamio.util.delay(function () {
                        childViewAlt.slide("slide-right");
                        childView.slide("slide-default");
                    }, 0);

                    break;
                }
            }

            this.popView();
            this.childCount--;
        },

        init: function () {

            // Setup references
            var self = this,
                target,
                url;

            // Setup view variables
            parentView = this.parentView;
            childView = this.childView;
            childViewAlt = this.childViewAlt;
            modalView = this.modalView;
            mediaView = this.mediaView;

            // Kick off
            self.resetViews();

            // Load the initial view URL if set
            if (typeof Andamio.config.initialView === "string") {
                self.openParentPage(Andamio.config.initialView, null, "refresh");
            } else {
                self.openParentPage();
                self.currentUrl = Andamio.config.server;
            }

            /**
             * Setup action listeners
             */
            Andamio.events.attach(".action-push", function (event) {

                target = $(event.currentTarget);
                url = Andamio.util.getUrl(target);

                self.pushChild(url);
            }, true);

            Andamio.events.attach(".action-pop", function () {

                self.popChild();
            }, true);

            Andamio.events.attach(".action-show-modal", function (event) {

                target = $(event.currentTarget);
                url = Andamio.util.getUrl(target);

                if (Andamio.nav.status && !$.os.tablet) Andamio.nav.hide();

                self.pushModal(url);
            }, true);

            Andamio.events.attach(".action-hide-modal", function () {

                self.popModal();
            }, true);

            Andamio.events.attach(".action-show-media", function (event) {

                target = $(event.currentTarget);
                url = Andamio.util.getUrl(target);

                if (Andamio.nav.status && !$.os.tablet) Andamio.nav.hide();

                self.pushMedia(url);
            }, true);

            Andamio.events.attach(".action-hide-media", function () {

                self.popMedia();
            }, true);

            Andamio.events.attach(".action-refresh", function () {

                self.refreshView();
            }, true);

            // Swipe right to go back
            if (Andamio.config.webapp && Andamio.config.touch) {
                Andamio.dom.doc.on("swipeRight", ".child-view", function () {

                    self.popChild();
                });
            }
        }
    };
})();
