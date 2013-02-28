module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['gruntfile.js', 'js/app/*.js'],
            options: {
                globals: {
                    es5: true,
                    browser: true,
                    indent:4,
                    undef:true,
                    unused:true
                }
            }
        },

        // Javascript concatenation
        concat: {
            andamio: {
                src: [
                    // Setup
                    'js/app/core.js',
                    'js/app/config.js',

                    // Reusable functions
                    'js/app/events.js',
                    'js/app/util.js',
                    'js/app/phone.js',

                    // Data handling
                    'js/app/cache.js',
                    'js/app/connection.js',
                    'js/app/page.js',
                    'js/app/pager.js',

                    // UI
                    'js/app/alert.js',
                    'js/app/loader.js',
                    'js/app/nav.js',
                    'js/app/reveal.js',
                    'js/app/search.js',
                    'js/app/slideshow.js',
                    'js/app/tabs.js',
                    'js/app/views.js',

                    // Initialize everything
                    'js/app/init.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            jquery: {
                src: [
                    'js/lib/jquery/jquery-2.0.0b1.js',
                    'js/lib/jquery/jquery.scrollto.js',
                    'js/lib/swipe.js',
                    'js/lib/fastclick.js',
                    'js/lib/lscache.js',
                    'dist/<%= pkg.name %>.js'
                    ],
                dest: 'dist/<%= pkg.name %>.jquery.js'
            },
            zepto: {
                src: [
                    'js/lib/zepto/zepto.js',
                    'js/lib/zepto/ajax.js',
                    'js/lib/zepto/event.js',
                    'js/lib/zepto/fx.js',
                    'js/lib/zepto/stack.js',
                    'js/lib/zepto.scroll.js',
                    'js/lib/swipe.js',
                    'js/lib/fastclick.js',
                    'js/lib/lscache.js',
                    'dist/<%= pkg.name %>.js'
                    ],
                dest: 'dist/<%= pkg.name %>.zepto.js'
            }
        },

        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.andamio.dest %>'],
                    'dist/<%= pkg.name %>.jquery.min.js': ['<%= concat.jquery.dest %>'],
                    'dist/<%= pkg.name %>.zepto.min.js': ['<%= concat.zepto.dest %>']
                }
            }
        },

        less: {
            dev: {
                files: {
                    'dist/<%= pkg.name %>.css': 'style/main.less'
                }
            },
            dist: {
                options: {
                    yuicompress: true
                },
                files: {
                    'dist/<%= pkg.name %>.min.css': 'style/main.less'
                }
            }
        },

        watch: {
            css: {
                files: ['style/main.less', 'style/*/*.less'],
                tasks: ['less:dev']
            },
            js: {
                files: ['js/app/*.js'],
                tasks: ['concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'less']);
};
