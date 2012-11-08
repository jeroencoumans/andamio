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
        less: {
          development: {
            options: {
              paths: ["style"]
            },
            files: {
              "dist/main.development.css": "style/main.less"
            }
          },
          production: {
            options: {
              paths: ["style"],
              yuicompress: true
            },
            files: {
              "dist/main.css": "style/main.less"
            }
          }
        }
    });

    // Load tasks from "grunt-sample" grunt plugin installed via Npm.
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task.
    grunt.registerTask('default', 'lint', 'less');

};