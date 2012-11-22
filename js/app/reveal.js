/**
 * Module for revealing contet
 */
APP.reveal = (function () {

    /**
     * Attach event listeners
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-reveal", function (event) {

            var activeReveal,
                activeContent,
                targetContent,
                activeClass = 'active',
                activeClassSelector = '.' + activeClass,
                target  = $(event.target).closest(".action-reveal");

            if (!target) {
                return;
            }

            activeReveal = target.siblings(activeClassSelector);

            if (activeReveal) {
                activeReveal.removeClass(activeClass);
            }

            target.addClass(activeClass);

            targetContent = APP.util.getUrl(target);

            if (!targetContent) {
                return;
            }

            activeContent = $(targetContent).siblings(activeClassSelector);

            if (activeContent) {
                activeContent.removeClass("active");
            }

            $(targetContent).addClass(activeClass);

            // don't follow the link
            event.preventDefault();
        });
    }

    /***
     * Initialize variables and attach listeners
     */
    function init() {

        attachListeners();
    }

    return {
        "init": init
    };

})();
