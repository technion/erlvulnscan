/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    
    react: {
      jsx: {
        files: {'assets/erlvulnscan.js': 'assets/erlvulnscan.jsx'}
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
    },
    concat: {
        options: {
            separator: ';',
        },
        dist: {
            src: ['assets/react-0.13.3.js', 'assets/sweetalert-dev.js', 'assets/erlvulnscan.js'],
            dest: 'public/erlvulnscan.js',
        },
    },
    uglify: {
        my_target: {
        files: { 'public/erlvulnscan.js': ['public/erlvulnscan.js'] }
        }
    }
  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('default', ['jshint', 'react', 'concat', 'uglify']);
};
