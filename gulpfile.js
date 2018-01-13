'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./client/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/src/'));
});
/*gulp.task('sass-component', function () {
  return gulp.src('./src/sass/components/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/components/'));
});
*/
gulp.task('sass:watch', function () {
  gulp.watch('./client/scss/**/*.scss', ['sass']);
  //gulp.watch('./src/sass/components/*.scss', ['sass-component']);
});