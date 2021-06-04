'use strict';

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-w3c-html-validation');

  grunt.initConfig({
    validation: {
      options: {
        reset: grunt.option('reset') || false,
        stoponerror: false,
        relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.'] //ignores these errors
      },
      files: {
        src: ['_site/**/*.html']
      }
    }
  });

  grunt.registerTask('default', ['validation']);
};
