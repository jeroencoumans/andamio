/**
 * Wrapper for doing an AJAX request
 */
APP.open = (function () {

    // function variables
    var current,
        parent,
        child,
        modal;

    /**
     * This function can be called to print or set the active URL (e.g. from views or modal)
     * href: the new URL
     **/
    function activeUrl(href) {
        if (href) {
            current = href;
        } else {
            return current;
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

        if ($.supports.cordova) {
            if (! APP.phone.isOnline) {
                alert("offline!");
            }
        }

        // make sure to open the parent
        if (APP.views.hasChildView() && view === APP.views.parentView()) {

            APP.views.openParentPage();
        }

        // variables
        var content = view.find(".js-content"),
            scrollPosition = content.get(0).scrollTop,
            timeoutToken = null;

        if (current === url) {

            console.log("opening the current url");
            return false;

        } else {

            current = url;
        }

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

        $.ajax({
            url: url,
            timeout: 10000,
            headers: { "X-PJAX": true },
            beforeSend: function() {

                // show loader if nothing is shown within 0,5 seconds
                timeoutToken = setTimeout(function() {
                    APP.loader.show();

                }, 250);

            },
            success: function(response){

                clearTimeout(timeoutToken);

                $(content).html(response);

                if (scrollPosition > 10) {
                    $.scrollElement($(content).get(0), 0);
                }
            },
            error: function(){

            },
            complete: function() {

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

            page(child, APP.views.childView(), refresh);
        } else if (APP.modal.status()) {

            page(modal, APP.modal.modalView(), refresh);
        } else {

            page(modal, APP.views.parentView(), refresh);
        }
    }

    return {
        "page": page,
        "refresh": refresh,
        "activeUrl": activeUrl,
        "parentUrl": parentUrl,
        "childUrl": childUrl,
        "modalUrl": modalUrl
    };

})();
