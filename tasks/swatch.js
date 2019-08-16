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
    let done = this.async(),
      options = this.options;

    if (this.data.targets) this.data.targets.forEach(target => {
      debug('Executing ss')
      
      new Probe(target, options, error => {
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
