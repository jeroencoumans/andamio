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
            dev: {
                src: [
                    'js/lib/zepto.js',
                    'js/lib/zepto.scroll.js',
                    'js/lib/swipeview.js',
                    'js/lib/fastclick.js',
                    'js/app/globals.js',
                    'js/app/util.js',
                    'js/app/events.js',
                    'js/app/phone.js',
                    'js/app/connection.js',
                    'js/app/loader.js',
                    'js/app/open.js',
                    'js/app/modal.js',
                    'js/app/nav.js',
                    'js/app/tabs.js',
                    'js/app/views.js',
                    'js/app/alert.js',
                    'js/app/init.js'
                    ],
                dest: 'dist/main.dev.js'
            }
        },

        // Javascript minification
        min: {
            dist: {
                src: ['dist/main.dev.js'],
                dest: 'dist/main.js'
            }
        },

        // CSS compilation & linting
        recess: {
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
                files: ['style/main.less', 'style/*/*.less'],
                tasks: 'recess:dev'
            },
            js: {
                files: ['js/*/*.js'],
                tasks: 'concat:dev'
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-recess');

    // Default task.
    grunt.registerTask('default', 'lint concat min recess');

};