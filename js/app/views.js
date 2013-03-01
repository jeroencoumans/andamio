/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

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
    function View(container, content, position) {
        this.container = container;

        if (content) {
            Object.defineProperties(this, {
                title: {
                    get: function () { return this.container.find(".js-title"); },
                    set: function (value) {
                        if (typeof value === "string") {
                            this.container.find(".js-title").text(value);
                        }
                    }
                },
                content: {
                    get: function () { return this.container.hasClass("js-content") ? this.container : this.container.find(".js-content"); }
                },
                scroller: {
                    get: function () {
                        if (Andamio.config.webapp) {
                            return this.container.hasClass("overthrow") ? this.container : this.container.find(".overthrow");
                        } else {
                            return Andamio.dom.win;
                        }
                    }
                }
            });
        }

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

        Object.defineProperties(this, {

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

    function ViewCollection() {

        this.list = new Andamio.util.Dictionary({
            parentView:   new View(Andamio.dom.parentView,   true, "slide-default"),
            childView:    new View(Andamio.dom.childView,    true, "slide-right"),
            childViewAlt: new View(Andamio.dom.childViewAlt, true, "slide-right"),
            modalView:    new View(Andamio.dom.modalView,    true, "slide-bottom")
        });

        var urlHistory = [];
        var viewHistory = [];
        var scrollHistory = [];

        this._urlHistory    = function () { return urlHistory; };
        this._viewHistory   = function () { return viewHistory; };
        this._scrollHistory = function () { return scrollHistory; };

        this.childCount = 0;
        this.modalCount = 0;

        Object.defineProperties(this, {

            currentUrl: {
                get: function ()      { return last(urlHistory); },
                set: function (value) { addUniq(value, urlHistory); }
            },

            previousUrl: {
                get: function ()      { return prev(urlHistory); }
            },

            currentView: {
                get: function ()      { return last(viewHistory); },
                set: function (value) { viewHistory.push(value); }
            },

            previousView: {
                get: function ()      { return prev(viewHistory); }
            },

            scrollPosition: {
                get: function ()      { return last(scrollHistory); },
                set: function (value) { scrollHistory.push(value); }
            },

        });

        this.resetViews = function () {

            this.list.each(function (value) {
                var view = Andamio.views.list.lookup(value);
                view.reset();
            });

            viewHistory = [];
            urlHistory = [];
            scrollHistory = [];
            this.childCount = 0;
        };

        this.activateView = function (view, url, expiration, scrollPosition) {

            if (this.list.contains(view)) {

                var currentView = this.list.lookup(view);

                currentView.active = true;

                if (url) {

                    Andamio.dom.doc.trigger("Andamio:views:activateView:start", [url]);

                    currentView.content.empty();

                    Andamio.page.load(url, expiration, function (response) {

                        currentView.content.html(response);

                        if (typeof scrollPosition === "number") {
                            currentView.scroller[0].scrollTop = scrollPosition;
                        }

                        Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [url]);
                    });
                }
            }
        };

        this.deactivateView = function (view) {

            if (this.list.contains(view)) {

                var currentView = this.list.lookup(view);
                currentView.active = false;
            }
        };

        this.pushView = function (view, url, expiration, scrollPosition) {

            if (this.list.contains(view)) {
                this.currentView = view;

                if (url) {
                    this.currentUrl = url;
                }

                if (this.previousView) {
                    this.scrollPosition = this.list.lookup(this.previousView).scroller[0].scrollTop;
                }

                this.activateView(view, url, expiration, scrollPosition);
                this.deactivateView(this.previousView);
            }
        };

        this.popView = function () {

            if (this.previousView) {

                // hide current
                this.deactivateView(this.currentView);

                // Fast path: parent view is still in the DOM, so just show it
                if (this.childCount === 1) {
                    this.activateView(this.previousView);
                } else {
                    this.activateView(this.previousView, this.previousUrl, false, this.scrollPosition);
                }

                // Delete the last view
                viewHistory.pop();
                urlHistory.pop();
                scrollHistory.pop();
            }
        };

        this.refreshView = function (expiration) {

            var url = this.currentUrl,
                currentView = this.list.lookup(this.currentView);

            if (url) {
                currentView.content.empty();

                Andamio.page.refresh(url, expiration, function (response) {

                    currentView.content.html(response);
                });
            }
        };

        this.openParentPage = function (url, expiration) {

            this.resetViews();

            var minutes = expiration || Andamio.config.cacheExpiration;
            this.pushView("parentView", url, minutes);
        };

        this.pushModal = function (url, expiration) {

            if (this.modalCount > 0) {
                return false;
            } else {

                if (Andamio.config.webapp) {
                    this.list.lookup("modalView").slide("slide-default");
                }

                this.pushView("modalView", url, expiration);
                this.modalCount++;
            }
        };

        this.popModal = function () {

            if (this.modalCount > 0) {

                if (Andamio.config.webapp) {
                    this.list.lookup("modalView").slide("slide-bottom");
                }

                this.popView();
                this.modalCount--;
            } else {
                return false;
            }
        };

        this.pushChild = function (url, expiration) {

            this.childCount++;

            var parentView   = this.list.lookup("parentView"),
                childView    = this.list.lookup("childView"),
                childViewAlt = this.list.lookup("childViewAlt"),
                currentView  = this.list.lookup(this.currentView);

            switch (currentView) {

            // Initial situation
            case parentView:
                this.pushView("childView", url, expiration, 0);

                if (Andamio.config.webapp) {
                    parentView.slide("slide-left");
                    childView.slide("slide-default");
                }

                break;

            case childView:
                this.pushView("childViewAlt", url, expiration, 0);

                if (Andamio.config.webapp) {
                    Andamio.dom.childViewAlt.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function () {
                        childView.slide("slide-left");
                        childViewAlt.slide("slide-default");
                    }, 0);
                }

                break;

            case childViewAlt:
                this.pushView("childView", url, expiration, 0);

                if (Andamio.config.webapp) {
                    Andamio.dom.childView.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function () {
                        childViewAlt.slide("slide-left");
                        childView.slide("slide-default");
                    }, 0);
                }

                break;
            }


        };

        this.popChild = function () {

            var parentView   = this.list.lookup("parentView"),
                childView    = this.list.lookup("childView"),
                childViewAlt = this.list.lookup("childViewAlt"),
                currentView  = this.list.lookup(this.currentView);

            switch (currentView) {
            case parentView:
                return; // abort!

            case childView:

                if (this.childCount === 1) {

                    parentView.slide("slide-default");
                    childView.slide("slide-right");

                } else {

                    Andamio.dom.childViewAlt.removeClass("slide-right").addClass("slide-left");

                    Andamio.util.delay(function () {
                        childView.slide("slide-right");
                        childViewAlt.slide("slide-default");
                    }, 0);
                }

                break;

            case childViewAlt:

                Andamio.dom.childView.removeClass("slide-right").addClass("slide-left");

                Andamio.util.delay(function () {
                    childViewAlt.slide("slide-right");
                    childView.slide("slide-default");
                }, 0);

                break;
            }

            this.popView();
            this.childCount--;
        };

        this.init = function () {

            if (typeof Andamio.config.initialView === "string") {
                Andamio.views.openParentPage(Andamio.config.initialView);
            } else {
                Andamio.views.openParentPage();
                Andamio.views.currentUrl = Andamio.config.server;
            }

            /**
             * Setup action listeners
             */
            Andamio.events.attach(".action-push", function (event) {

                var target = $(event.currentTarget),
                    url = Andamio.util.getUrl(target);

                Andamio.views.pushChild(url);
            });

            Andamio.events.attach(".action-show-modal", function (event) {

                var target = $(event.currentTarget),
                    url = Andamio.util.getUrl(target);

                Andamio.views.pushModal(url);
            });

            Andamio.events.attach(".action-pop", function () {

                Andamio.views.popChild();
            });

            Andamio.events.attach(".action-hide-modal", function () {

                Andamio.views.popModal();
            });

            Andamio.events.attach(".action-refresh", function () {

                Andamio.views.refreshView();
            });
        };
    }

    return new ViewCollection();
})();
