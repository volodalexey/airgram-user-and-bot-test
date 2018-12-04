const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence'); // https://stackoverflow.com/a/22826429/5431545
const tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', () => del(['./dist']));

gulp.task('copy', () => gulp
  .src(['./src/**/*', '!./**/*.ts'])
  .pipe(gulp.dest('./dist'))
);

gulp.task('build', () => tsProject.src()
  .pipe(sourcemaps.init())
  .pipe(tsProject())
  .js.pipe(sourcemaps.write()).pipe(gulp.dest('dist'))
);

gulp.task('default', (cb) => runSequence('clean', 'copy', 'build', cb));