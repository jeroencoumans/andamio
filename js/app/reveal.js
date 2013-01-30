/**
 * Module for revealing contet
 * @author Jeroen Coumans
 * @class reveal
 * @namespace APP
 */
APP.reveal = (function () {

    /**
     * Attach event listeners
     * @method attachListeners
     * @private
     */
    function attachListeners() {

        APP.events.attachClickHandler(".action-reveal", function (event) {

            APP.dom.doc.trigger("APP:action:reveal:start");

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

            APP.dom.doc.trigger("APP:action:reveal:finish");
        });
    }

    /***
     * Ataches listeners
     * @method init
     */
    function init() {

        attachListeners();
    }

    return {
        "init": init
    };

})();
