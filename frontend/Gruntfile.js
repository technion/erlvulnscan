/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    
    react: {
      jsx: {
        files: {'public/erlvulnscan.js': 'assets/erlvulnscan.jsx'}
      }
    },
    jshint: {
        all: ['assets/erlvulnscan.jsx']
    }

  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-jsxhint');

  
  grunt.registerTask('default', ['jshint', 'react']);
};
