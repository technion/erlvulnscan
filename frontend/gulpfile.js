//Includes for the jshint task
var gulp = require('gulp'); 

//Includes for the build
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

//Shell to execute phantomjs
var shell = require('gulp-shell');
 
var eslint = require('gulp-eslint');
var babelify = require('babelify');

jsfiles = './assets/erlvulnscan.jsx';

gulp.task('build', function() {
    return browserify({ entries: jsfiles, debug: false })
        .transform(babelify, {compact: false})
        .bundle()
        .pipe(source('erlvulnscan.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./build'));
});

gulp.task('dev', function () {
    return browserify({ entries: jsfiles, debug: true })
        .transform(babelify, {compact: false})
        .bundle()
        .pipe(source('erlvulnscan.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('eslint', function() {
  gulp.src(jsfiles)
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
});

gulp.task('css', function() {
    gulp.src('./bower_components/sweetalert/dist/sweetalert.css')
    .pipe(gulp.dest('./build'))
});

gulp.task('phantom', shell.task(['phantomjs tests/phantomtest.js']));

gulp.task('default', ['eslint', 'css', 'build', 'phantom']);

