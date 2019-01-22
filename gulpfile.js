const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');
const outputDir = './dist';

function clean() {
  return del([outputDir])
}

function copy() {
  return gulp
    .src(['./src/**/*', '!./**/*.ts'])
    .pipe(gulp.dest(outputDir))
}

function build() {
  return gulp.src('./src/**/*.ts', { sourcemaps: true })
  .pipe(tsProject()).js
  .pipe(gulp.dest(outputDir, { sourcemaps: '.' }))
}

exports.default = gulp.series(clean, copy, build);