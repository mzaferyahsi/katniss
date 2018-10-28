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

gulp.task('_pre-test', () => gulp.src(['./src/*.js'])
// Covering files
  .pipe(istanbul())
// Force `require` to return covered files
  .pipe(istanbul.hookRequire()));

gulp.task('_test', gulp.series('_pre-test', () => gulp.src(['test/**/*.js'])
  .pipe(mocha())
// Creating the reports after tests ran
  .pipe(istanbul.writeReports({
    reporters: ['lcov', 'cobertura', 'text'],
  })) // Enforce a coverage of at least 90%
  .pipe(istanbul.enforceThresholds({
    thresholds: {
      global: {
        statements: 80,
        branches: 75,
        lines: 80,
        functions: 80,
      },
      each: {
        statements: 80,
        branches: 75,
        lines: 80,
        functions: 80,
      },
    },
  }))));

gulp.task('test', gulp.series('_lint', '_test'));
