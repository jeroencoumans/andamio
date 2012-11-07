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
        'app/nav': {
            deps: ['lib/zepto']
        },
        'app/init': {
            deps: ['lib/zepto', 'app/events', 'app/util']
        }
    }
})

require(["lib/less", "lib/zepto", "lib/zepto.scroll", "lib/fastclick", "app/globals", "app/events", "app/util", "app/nav", "app/init"], function() {

        $(document).ready(function() {
            APP.core.init();

            // Seed parent-view
            $.get('style/page/page.html', function(response){
                $("#parent-view .page-content").html(response);
            });
        });

});