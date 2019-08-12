/*
 * grunt-swatch
 * https://github.com/june07/grunt-watch
 *
 * Copyright (c) 2019 june07
 * Licensed under the MIT license.
 */

'use strict';

const debug = require('debug')('swatch'),

  Probe = require('../probe').Probe;

let swatchers = [];

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('swatch', 'Run tasks whenever watched sockets change.', function() {
    let done = this.async();
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });
    if (this.data.ports) this.data.ports.forEach(port => {
      debug('Executing ss')
      debugger
      
      new Probe(port, options, error => {
        if (error) {
          if (typeof error === 'string') {
            error = new Error(error);
          }
          grunt.log.writeln('ERROR'.red);
          grunt.fatal(error);
        }
      });
    });
  });

};
