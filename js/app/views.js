/*jshint es5: true, browser: true */
/*global Andamio, $ */

Andamio.views = (function () {

    function last(list) {
        if (list.length > 0) {
            return list[list.length - 1];
        }
    }

    function prev(list) {
        if (list && list.length > 1) {
            return list[list.length -2];
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
                    get: function() { return this.container.find(".js-title"); },
                    set: function(value) {
                        if (typeof value === "string") {
                            this.container.find(".js-title").text(value);
                        }
                    }
                },
                content: {
                    get: function() { return this.container.hasClass("js-content") ? this.container : this.container.find(".js-content"); }
                },
                scroller: {
                    get: function() {
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
            this.slide = function(direction) {
                var container = this.container,
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
    }

    /**
     * Resets the view to its original state
     */
    View.prototype.reset = function() {

        if (this.position && Andamio.config.webapp) {
            this.position = this.initialPosition;
            this.container
                .removeClass("slide-left")
                .removeClass("slide-right")
                .removeClass("slide-default")
                .removeClass("slide-bottom")
                .addClass(this.position);
        }

        this.active = false;
    };

    Object.defineProperties(View, {

        active: {
            get: function() {
                return this.container.hasClass("view-active");
            },
            set: function(value) {
                if (value) {
                    this.container.addClass("view-active").removeClass("view-hidden");
                } else {
                    this.container.addClass("view-hidden").removeClass("view-active");
                }
            }
        }
    });

    function ViewCollection() {

        this.list = new Andamio.util.Dictionary({
            parentView: new View(Andamio.dom.parentView, true, "slide-default"),
            childView:  new View(Andamio.dom.childView, true, "slide-right"),
            modalView:  new View(Andamio.dom.modalView, true, "slide-bottom")
        });

        var urlHistory = [];
        var viewHistory = [];
        var scrollHistory = [];

        this._urlHistory = function()    { return urlHistory; };
        this._viewHistory = function()   { return viewHistory; };
        this._scrollHistory = function() { return scrollHistory; };

        this.childCount = 0;
        this.modalCount = 0;

        // For 2-page apps, use the fastPath
        var fastPath = true;

        Object.defineProperties(this, {

            currentUrl: {
                get: function()      { return last(urlHistory); },
                set: function(value) { addUniq(value, urlHistory); }
            },

            previousUrl: {
                get: function()      { return prev(urlHistory); }
            },

            currentView: {
                get: function()      { return last(viewHistory); },
                set: function(value) { viewHistory.push(value); }
            },

            previousView: {
                get: function()      { return prev(viewHistory); }
            },

            scrollPosition: {
                get: function()      { return last(scrollHistory); },
                set: function(value) { scrollHistory.push(value); }
            },

        });

        this.resetViews = function() {

            this.list.each(function(value) {
                var view = Andamio.views.list.lookup(value);
                view.reset();
            });

            viewHistory = [];
            urlHistory = [];
            scrollHistory = [];
            fastPath = true;
        };

        this.activateView = function(view, url, expiration, scrollPosition) {

            if (this.list.contains(view)) {

                var currentView = this.list.lookup(view);

                currentView.active = true;

                if (url) {

                    Andamio.dom.doc.trigger("Andamio:views:activateView:start", [url]);

                    currentView.content.empty();

                    Andamio.page.load(url, expiration, function(response) {

                        currentView.content.html(response);

                        if (typeof scrollPosition === "number") {
                            currentView.scroller[0].scrollTop = scrollPosition;
                        }

                        Andamio.dom.doc.trigger("Andamio:views:activateView:finish", [url]);
                    });
                }
            }
        };

        this.deactivateView = function(view) {

            if (this.list.contains(view)) {

                var currentView = this.list.lookup(view);
                currentView.active = false;
            }
        };

        this.pushView = function(view, url, expiration, scrollPosition) {

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

        this.popView = function() {

            if (this.previousView) {

                // hide current
                this.deactivateView(this.currentView);

                // Fast path: last view is still in the DOM, so just show it
                if (fastPath) {

                    this.activateView(this.previousView);
                } else {

                    this.activateView(this.previousView, this.previousUrl, false, this.scrollPosition);
                }

                // Delete the last view
                viewHistory.pop();
                urlHistory.pop();
                scrollHistory.pop();

                if (this.childCount === 0) fastPath = true;
            }
        };

        this.refreshView = function(expiration) {

            var url = this.currentUrl,
                currentView = this.list.lookup(this.currentView);

            if (url) {
                currentView.content.empty();

                Andamio.page.refresh(url, expiration, function(response) {

                    currentView.content.html(response);
                });
            }
        };

        this.openParentPage = function(url, expiration) {

            this.resetViews();

            var minutes = expiration || 24 * 60; // lscache sets expiration in minutes, so this is 24 hours
            this.pushView("parentView", url, minutes);
        };

        this.pushModal = function(url, expiration) {

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

        this.popModal = function() {

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

        this.pushChild = function(url, expiration) {

            this.childCount++;

            if (this.childCount > 1) {
                fastPath = false;
            }

            var parentView  = this.list.lookup("parentView"),
                childView   = this.list.lookup("childView");

            if (this.childCount % 2 > 0) {

                if (Andamio.config.webapp) {
                    Andamio.dom.childView.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function() {
                        parentView.slide("slide-left");
                        childView.slide("slide-default");
                    }, 0);
                }

                this.pushView("childView", url, expiration, 0);

            } else {

                if (Andamio.config.webapp) {
                    Andamio.dom.parentView.removeClass("slide-left").addClass("slide-right");

                    Andamio.util.delay(function() {
                        parentView.slide("slide-default");
                        childView.slide("slide-left");
                    }, 0);
                }

                this.pushView("parentView", url, expiration, 0);
            }
        };

        this.popChild = function() {

            var parentView  = this.list.lookup("parentView"),
                childView   = this.list.lookup("childView");

            if (this.childCount % 2 > 0) {

                if (Andamio.config.webapp) {

                    Andamio.dom.parentView.removeClass("slide-right").addClass("slide-left");

                    Andamio.util.delay(function() {
                        parentView.slide("slide-default");
                        childView.slide("slide-right");
                    }, 0);
                }

            } else {

                if (Andamio.config.webapp) {

                    Andamio.dom.childView.removeClass("slide-right").addClass("slide-left");

                    Andamio.util.delay(function() {
                        childView.slide("slide-default");
                        parentView.slide("slide-right");
                    }, 0);
                }
            }

            this.popView();
            this.childCount--;
        };

        this.init = function() {

            if (typeof Andamio.config.initialView === "string") {
                Andamio.views.openParentPage(Andamio.config.initialView);
            } else {
                Andamio.views.currentView = "parentView";
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

            if (Andamio.config.os.android) {
                navigator.bootstrap.addConstructor(function() {
                    Andamio.dom.doc.addEventListener("backbutton", function() {
                        Andamio.views.popChild();
                    });
                });
            }

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
