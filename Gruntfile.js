/*
 * grunt-swatch
 * https://github.com/june07/grunt-watch
 *
 * Copyright (c) 2019 june07
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Need to start a test server
    connect: {
      server: {
        options: {
          port: 45670
        }
      }
    },
    // Configuration to be run (and then tested).
    swatch: {
      test: {
        test: true,
        targets: [{
          port: 'tcp/45670',
          actions: [{
            name: 'inspector',
            args: {
              port: 9229
            }
          }]
        }]
      },
      default: {
        targets: [{
          port: 'tcp/45670',
          actions: [{
            name: 'inspector',
            args: {
              port: 9230
            }
          }]
        }],
      }
    },

    // Unit tests.
    nodeunit: {
      //tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'connect', 'swatch:test']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
