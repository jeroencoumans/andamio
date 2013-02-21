/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        lint: {
            all: ['grunt.js', 'js/app/*.js']
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
                dest: 'dist/andamio.js'
            },
            jquery: {
                src: [
                    'js/lib/jquery/jquery-2.0.0b1.js',
                    'js/lib/jquery/jquery.scrollto.js',
                    'js/lib/swipe.js',
                    'js/lib/fastclick.js',
                    'js/lib/lscache.js',
                    'dist/andamio.js'
                    ],
                dest: 'dist/andamio.jquery.js'
            },
            zepto: {
                src: [
                    'js/lib/zepto.js',
                    'js/lib/zepto.scroll.js',
                    'js/lib/swipe.js',
                    'js/lib/fastclick.js',
                    'js/lib/lscache.js',
                    'dist/andamio.js'
                    ],
                dest: 'dist/andamio.zepto.js'
            }
        },

        // Javascript minification
        min: {
            andamio: {
                src:  'dist/andamio.js',
                dest: 'dist/andamio.min.js'
            },
            jquery: {
                src:  'dist/andamio.jquery.js',
                dest: 'dist/andamio.jquery.min.js'
            },
            zepto: {
                src:  'dist/andamio.zepto.js',
                dest: 'dist/andamio.zepto.min.js'
            }
        },

        // CSS compilation & linting
        less: {
            dev: {

                files: {
                    'dist/andamio.css': 'style/main.less'
                }
            },
            dist: {
                options: {
                    yuicompress: true
                },
                files: {
                    'dist/andamio.min.css': 'style/main.less'
                }
            }
        },
        watch: {
            css: {
                files: ['style/andamio.less', 'style/*/*.less'],
                tasks: ['less:dev']
            },
            js: {
                files: ['js/*/*.js'],
                tasks: ['concat:andamio', 'concat:jquery', 'concat:zepto']
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task.
    grunt.registerTask('default', 'lint concat min less');

};
