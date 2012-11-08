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
        recess: {
            dist: {
                src: ['style/main.less'],
                dest: 'dist/main.css',
                options: {
                    compile: true,
                    compress: true
                }
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-recess');

    // Default task.
    grunt.registerTask('default', 'lint', 'recess');

};