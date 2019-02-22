import gulp from 'gulp';
import mocha from 'gulp-mocha';
import jshint from 'gulp-jshint';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';

gulp.task('_lint', () => gulp.src(['./src/**/*.js', '!./src/**/*.spec.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'))
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('_test', () => gulp.src(['./src/**/*.spec.js'])
  .pipe(babel())
  .pipe(mocha({
    require: [
      '@babel/register'
    ],
    reporter: 'mocha-junit-reporter',
    reporterOptions :{
      mochaFile:'./junit/test-results.xml'
    }
  }))
);

gulp.task('test', gulp.series('_lint', '_test'));