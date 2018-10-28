const gulp = require('gulp');
const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');

gulp.task('_lint', () => gulp.src(['./src/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('_test', () => gulp.src(['./test/**/*.js'])
  .pipe(mocha())
);

gulp.task('test', gulp.series('_lint', '_test'));
