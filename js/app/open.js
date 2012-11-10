/**
 * Do an AJAX request and insert it into a view
 */
APP.open = (function () {

    /**
     * Do an AJAX request and insert it into a view
     * - url: the URL to call
     * - view: what page to insert the content int (child, parent or modal)
     */
    function page(url, view) {

        // make sure to open the parent
        if (APP.views.hasChildView() && view === APP.views.parentView()) {

            backwardAnimation();
        }

        var timeoutToken = null;
        $.ajax({
            url: url,
            timeout: 10000,
            headers: { "X-PJAX": true },
            beforeSend: function() {

                // show loader if nothing is shown within 0,5 seconds
                timeoutToken = setTimeout(function() {
                    APP.loader.show();

                }, 500);

            },
            success: function(response){

                var content = view.find(".js-content");

                clearTimeout(timeoutToken);

                $(content).html(response);
                $.scrollElement($(content).get(0), 0);
            },
            error: function(){

            },
            complete: function() {

                APP.loader.hide();
            }
        });
     }

    return {
        "page": page
    };

})();
