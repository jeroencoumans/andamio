/**
 * Wrapper for doing an AJAX request
 */
APP.open = (function () {

    // function variables
    var active,
        parent,
        child,
        modal;

    /**
     * This function can be called to print or set the active URL (e.g. from views or modal)
     * @param: URL, the new URL
     **/
    function activeUrl(href) {
        if (href) {
            active = href;
        } else {
            return active;
        }
    }

    // Export these elements for other modules
    function parentUrl() { return parent; }
    function childUrl()  { return child;  }
    function modalUrl()  { return modal;  }

    /**
     * Do an AJAX request and insert it into a view
     * - url: the URL to call
     * - view: what page to insert the content int (child, parent or modal)
     * - refresh: explicitly refresh the page
     */
    function page(url, view, refresh) {

        // make sure to open the parent
        if (APP.views.hasChildView() && view === APP.views.parentView()) {

            APP.views.openParentPage();
        }

        // variables
        var content = view.find(".js-content"),
            scrollPosition = content.get(0).scrollTop,
            timeoutToken = null;

        // Set the URL of the view
        switch (view) {
            case APP.views.parentView():
                parent = url;
                break;

            case APP.views.childView():
                child = url;
                break;

            case APP.modal.modalView():
                modal = url;
                break;
        }

        // Prevent page load when opening the same URL
        if (active === url && ! refresh) {

            return false;
        } else {

            // Set the active url to the passed url
            active = url;
            content.empty();
        }

        $.ajax({
            url: url,
            timeout: 5000,
            headers: { "X-PJAX": true },
            beforeSend: function() {

                // show loader if nothing is shown within 0,5 seconds
                timeoutToken = setTimeout(function() {
                    APP.loader.show();

                }, 250);

            },
            success: function(response){

                // if we were offline, reset the connection to online
                APP.connection.status("online");

                $(content).html(response);

                if (scrollPosition > 10) {
                    $.scrollElement($(content).get(0), 0);
                }
            },
            error: function(xhr, errorType, error){

                APP.connection.status("offline");
            },
            complete: function() {

                clearTimeout(timeoutToken);
                APP.loader.hide();
            }
        });
    }

    /**
     * Refresh the active view
     */
    function refresh() {

        // check wether to refresh child or parent page
        if (APP.views.hasChildView()) {

            page(child, APP.views.childView(), "refresh");

        } else if (APP.modal.status()) {

            page(modal, APP.modal.modalView(), "refresh");

        } else {

            page(parent, APP.views.parentView(), "refresh");
        }
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** Open parent page ***/
        APP.events.attachClickHandler(".action-refresh", function (event) {

            refresh();
        });
    }

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        attachListeners();
    }

    return {
        "init": init,
        "page": page,
        "refresh": refresh,
        "activeUrl": activeUrl,
        "parentUrl": parentUrl,
        "childUrl": childUrl,
        "modalUrl": modalUrl
    };

})();
