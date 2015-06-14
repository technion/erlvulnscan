/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    
    react: {
      jsx: {
        files: {'erlvulnscan.js': 'erlvulnscan.jsx'}
      }
    },
    jshint: {
        all: ['erlvulnscan.jsx']
    }

  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-jsxhint');

  
  grunt.registerTask('default', ['jshint', 'react']);
};
