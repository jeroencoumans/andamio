/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

/*** TODO: add support for data-title ***/

Andamio.views = (function () {

    function last(list) {
        if (list.length > 0) {
            return list[list.length - 1];
        }
    }

    function prev(list) {
        if (list && list.length > 1) {
            return list[list.length - 2];
        }
    }

    function addUniq(value, list) {
        if (value !== last(list)) {
            list.push(value);
        }
    }

    /**
     * A view has a container, optional content and position
     */
    function View(container, position) {
        this.container = container;

        Object.defineProperties(this, {
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
            }
        });

        if (position) {
            this.initialPosition = position;
            this.position = position;

            /**
             * Slide the view based on the current position and the desired direction. Used only in webapp.
             * @method slide
             * @param direction {String} direction to which the view should slide
             */
            this.slide = function (direction) {
                var container = this.container,
                    position = this.position;

                Andamio.events.lock();

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
    }

    /**
     * Resets the view to its original state
     */
    View.prototype.reset = function () {

        if (this.position && Andamio.config.webapp) {

            this.position = this.initialPosition;
            this.container
                .removeClass("slide-left slide-right slide-default slide-bottom")
                .addClass(this.position);
        }

        this.active = false;
    };

    var parentView,
        childView,
        childViewAlt,
        modalView;

    return {

        parentView   : new View(Andamio.dom.parentView,   "slide-default"),
        childView    : new View(Andamio.dom.childView,    "slide-right"),
        childViewAlt : new View(Andamio.dom.childViewAlt, "slide-right"),
        modalView    : new View(Andamio.dom.modalView,    "slide-bottom"),

        urlHistory   : [],
        viewHistory  : [],
        scrollHistory: [],

        childCount   : 0,
        modalCount   : 0,

        get currentUrl()        { return last(this.urlHistory); },
        set currentUrl(val)     { addUniq(val, this.urlHistory); }, // TODO: when opening the same URL in a new view, history gets messed up

        get previousUrl()       { return prev(this.urlHistory); },
        get currentView()       { return last(this.viewHistory); },
        set currentView(val)    { this.viewHistory.push(val); },
        get previousView()      { return prev(this.viewHistory); },

        get scrollPosition()    { return last(this.scrollHistory); },
        set scrollPosition(val) { this.scrollHistory.push(val); },

        resetViews: function () {

            this.parentView.reset();
            this.childView.reset();
            this.childViewAlt.reset();
            this.modalView.reset();

            this.viewHistory = [];
            this.urlHistory = [];
            this.scrollHistory = [];
            this.childCount = 0;
            this.modalCount = 0;
        },

        activateView: function (view, url, expiration, scrollPosition) {

            view.active = true;

            Andamio.dom.doc.trigger("Andamio:views:activateView:start", [view]);

            if (url) {

                view.content[0].innerHTML = "";

                Andamio.page.load(url, expiration, true, function (response) {

                    view.content[0].insertAdjacentHTML("afterBegin", response);

                    if (typeof scrollPosition === "number") {
                        view.scroller[0].scrollTop = scrollPosition;
                    }

                    Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [view]);
                });
            } else {
                Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [view]);
            }
        },

        deactivateView: function (view) {

            view.active = false;
        },

        pushView: function (view, url, expiration, scrollPosition) {

            this.currentView = view;

            if (url) {
                this.currentUrl = url;
            }

            if (this.previousView) {
                this.scrollPosition = this.previousView.scroller[0].scrollTop;
                this.deactivateView(this.previousView);
            }

            this.activateView(view, url, expiration, scrollPosition);
        },

        popView: function () {

            if (this.previousView) {

                // hide current
                this.deactivateView(this.currentView);

                // Delete the last view
                this.viewHistory.pop();
                this.scrollHistory.pop();

                // Only pop history if there's more than 1 item
                if (this.urlHistory.length > 1) {
                    this.urlHistory.pop();
                }

                // Fast path: parent view is still in the DOM, so just show it
                if (this.childCount === 1) {
                    this.activateView(this.currentView);
                } else {
                    this.activateView(this.currentView, this.currentUrl, false, this.scrollPosition);
                }

            }
        },

        refreshView: function (expiration, callback) {

            var url = this.currentUrl,
                currentView = this.currentView,
                currentViewContent = currentView.content[0];

            if (url) {

                Andamio.dom.doc.trigger("Andamio:views:activateView:start", [currentView, url]);
                currentViewContent.innerHTML = "";

                Andamio.page.refresh(url, expiration, function (response) {

                    currentViewContent.insertAdjacentHTML("afterBegin", response);
                    Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [currentView, url]);

                    if ($.isFunction(callback)) {
                        callback();
                    }
                });
            }
        },

        openParentPage: function (url, expiration) {

            this.resetViews();
            this.pushView(parentView, url, expiration, 0);
        },

        pushModal: function (url, expiration) {

            if (this.modalCount > 0) {
                return false;
            } else {

                if (Andamio.config.webapp) {
                    this.modalView.slide("slide-default");
                }

                this.pushView(this.modalView, url, expiration);
                this.modalCount++;
            }
        },

        popModal: function () {

            if (this.modalCount > 0) {

                if (Andamio.config.webapp) {
                    this.modalView.slide("slide-bottom");
                }

                this.popView();
                this.modalCount--;
            } else {
                return false;
            }
        },

        pushChild: function (url, expiration) {

            this.childCount++;

            switch (this.currentView) {

            // Initial situation
            case parentView:
                this.pushView(childView, url, expiration, 0);

                if (Andamio.config.webapp) {
                    parentView.slide("slide-left");
                    childView.slide("slide-default");
                }

                break;

            case childView:
                this.pushView(childViewAlt, url, expiration, 0);

                if (Andamio.config.webapp) {
                    childViewAlt.container.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function () {
                        childView.slide("slide-left");
                        childViewAlt.slide("slide-default");
                    }, 0);
                }

                break;

            case childViewAlt:
                this.pushView(childView, url, expiration, 0);

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

            var self = this,
                target,
                url;

            parentView = this.parentView;
            childView = this.childView;
            childViewAlt = this.childViewAlt;
            modalView = this.modalView;

            if (typeof Andamio.config.initialView === "string") {
                self.openParentPage(Andamio.config.initialView);
            } else {
                self.openParentPage();
                self.currentUrl = Andamio.config.server;
            }

            /**
             * Setup action listeners
             */
            Andamio.events.attach(".action-push", function (event) {

                target = $(event.currentTarget),
                url = Andamio.util.getUrl(target);

                self.pushChild(url);
            }, true);

            Andamio.events.attach(".action-show-modal", function (event) {

                target = $(event.currentTarget),
                url = Andamio.util.getUrl(target);

                self.pushModal(url);
            }, true);

            Andamio.events.attach(".action-pop", function () {

                self.popChild();
            }, true);

            Andamio.events.attach(".action-hide-modal", function () {

                self.popModal();
            }, true);

            Andamio.events.attach(".action-refresh", function () {

                self.refreshView();
            }, true);
        }
    };

})();
