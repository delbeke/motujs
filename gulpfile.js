var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')

gulp.task('dev', function () {
  return gulp.src('src/**/*.es6')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
})

gulp.task('default', ['dev'])

gulp.task('watch', ['dev'], function () {
  gulp.watch('src/**/*.es6', ['dev'])
})
