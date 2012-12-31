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
            zepto: {
                src: [
                    'js/lib/zepto/zepto.js',
                    'js/lib/zepto/ajax.js',
                    'js/lib/zepto/detect.js',
                    'js/lib/zepto/event.js'
                    ],
                dest: 'js/lib/zepto.js'
            },
            andamio: {
                src: [
                    'js/app/globals.js',
                    'js/app/util.js',
                    'js/app/events.js',
                    'js/app/phone.js',
                    'js/app/connection.js',
                    'js/app/loader.js',
                    'js/app/open.js',
                    'js/app/modal.js',
                    'js/app/nav.js',
                    'js/app/reveal.js',
                    'js/app/search.js',
                    'js/app/store.js',
                    'js/app/tabs.js',
                    'js/app/views.js',
                    'js/app/alert.js',
                    'js/app/init.js'
                ],
                dest: 'dist/andamio-lib.js'
            },
            mobile: {
                src: [
                    'js/lib/zepto.js',
                    'js/lib/zepto.scroll.js',
                    'js/lib/swipeview.js',
                    'js/lib/fastclick.js',
                    'js/lib/lscache.js',
                    'dist/andamio-lib.js'
                    ],
                dest: 'dist/main.dev.js'
            },
            desktop: {
                src: [
                    'js/lib/jquery/jquery-1.8.3.min.js',
                    'js/lib/swipeview.js',
                    'js/lib/lscache.js',
                    'dist/andamio-lib.js'
                    ],
                dest: 'dist/main-desktop.dev.js'
            }
        },

        // Javascript minification
        min: {
            mobile: {
                src: ['dist/main.dev.js'],
                dest: 'dist/main.js'
            },
            desktop: {
                src: ['dist/main-desktop.dev.js'],
                dest: 'dist/main-desktop.js'
            }
        },

        // CSS compilation & linting
        recess: {
            doc: {
                src: ['doc/main.less'],
                dest: 'doc/main.css',
                options: {
                    compile: true,
                    compress: true
                }
            },
            dev: {
                src: ['style/main.less'],
                dest: 'dist/main.dev.css',
                options: {
                    compile: true
                }
            },
            dist: {
                src: ['style/main.less'],
                dest: 'dist/main.css',
                options: {
                    compile: true,
                    compress: true
                }
            }
        },
        watch: {
            css: {
                files: ['style/main.less', 'style/*/*.less', 'doc/main.less'],
                tasks: ['recess:dev', 'recess:doc']
            },
            js: {
                files: ['js/*/*.js', 'doc/js/*.js'],
                tasks: ['concat:dev']
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-recess');

    // Default task.
    grunt.registerTask('default', 'lint concat min recess');

};