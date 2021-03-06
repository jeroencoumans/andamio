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
                    'js/app/i18n.js',
                    'js/app/config.js',

                    // Reusable functions
                    'js/app/events.js',
                    'js/app/util.js',
                    'js/app/container.js',

                    // Data handling
                    'js/app/cache.js',
                    'js/app/connection.js',
                    'js/app/page.js',
                    'js/app/pager.js',

                    // UI
                    'js/app/alert.js',
                    'js/app/loader.js',
                    'js/app/nav.js',
                    'js/app/pull-to-refresh.js',
                    'js/app/reveal.js',
                    'js/app/slideshow.js',
                    'js/app/tabs.js',
                    'js/app/views.js',

                    // Initialize everything
                    'js/app/init.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            libs: {
                src: [
                    'js/lib/swipe.js',      // https://github.com/bradbirdsall/Swipe
                    'js/lib/fastclick.js',  // https://github.com/ftlabs/fastclick
                    'js/lib/lscache.js'     // https://github.com/pamelafox/lscache
                ],
                dest: 'dist/<%= pkg.name %>.libs.js'
            },

            jquery: {
                src: [
                    'js/lib/jquery/jquery-2.0.0b1.js',
                    'js/lib/jquery/jquery.scrollto.js',
                    'dist/<%= pkg.name %>.libs.js',
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
                    'js/lib/zepto/touch.js',
                    'js/lib/zepto.scroll.js',
                    'dist/<%= pkg.name %>.libs.js',
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
                    'dist/<%= pkg.name %>.css': 'css/main.less'
                }
            },
            dist: {
                options: {
                    yuicompress: true
                },
                files: {
                    'dist/<%= pkg.name %>.min.css': 'css/main.less'
                }
            }
        },

        watch: {
            css: {
                files: ['css/main.less', 'css/*/*.less'],
                tasks: ['less:dev']
            },
            js: {
                files: ['js/app/*.js'],
                tasks: ['concat']
            }
        },

        casperjs: {
            options: {
                includes: ['tests/config.js']
            },
            files: ['tests/casperjs/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-casperjs');

    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'less']);
};
