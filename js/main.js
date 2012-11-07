requirejs.config({
    shim: {
        'lib/zepto.scroll': {
            deps: ['lib/zepto']
        },
        'app/events': {
            deps: ['lib/zepto']
        },
        'app/util': {
            deps: ['lib/zepto']
        },
        'app/loader': {
            deps: ['lib/zepto']
        },
        'app/nav': {
            deps: ['lib/zepto', 'app/loader']
        },
        'app/modal': {
            deps: ['lib/zepto', 'app/loader']
        },
        'app/tabs': {
            deps: ['lib/zepto', 'app/views', 'app/loader']
        },
        'app/views': {
            deps: ['lib/zepto', 'app/loader']
        },
        'app/init': {
            deps: ['lib/zepto', 'app/events', 'app/nav', 'app/views', 'app/util']
        }
    }
})

require(["lib/zepto", "lib/zepto.scroll", "lib/fastclick", "app/globals", "app/events", "app/loader", "app/util", "app/views", "app/tabs", "app/nav", "app/modal", "app/init"], function() {

    $(document).ready(function() {
        APP.core.init();

        // Seed parent-view
        $.get('style/page/page.html', function(response){
            $("#parent-view .page-content").html(response);
        });
    });

});