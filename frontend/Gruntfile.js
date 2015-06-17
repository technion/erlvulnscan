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
    },
    validation: {
        options: {
            relaxerror: ['This interface to HTML5 document checking is deprecated']
        },
        file: {
        src: ['public/index.html']
        }
    }

  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-html-validation');


  grunt.registerTask('default', ['jshint', 'react']);
};
