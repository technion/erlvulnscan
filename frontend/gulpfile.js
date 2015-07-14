//Includes for the jshint task
var gulp = require('gulp'); 
var jsx = require('gulp-jsxtransform');
var jshint = require('gulp-jshint');

//Includes for the build
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
 
jsfiles = './assets/erlvulnscan.jsx';

gulp.task('build', function() {
    var b = browserify({ entries: jsfiles });
    b.transform(reactify);
    return b.bundle()
    .pipe(source('erlvulnscan.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./build'));
});

gulp.task('jshint', function() {
  gulp.src(jsfiles)
    .pipe(jsx())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('css', function() {
    gulp.src('./bower_components/sweetalert/dist/sweetalert.css')
    .pipe(gulp.dest('./build'))
});

gulp.task('default', ['jshint', 'css', 'build']);

