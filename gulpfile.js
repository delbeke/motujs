const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const browserify = require('browserify')
const babelify = require('babelify')
const fs = require('fs')
const del = require('del')

gulp.task('dev', ['clean'], function() {
  return browserify({
    basedir: 'src',
    extensions: ['.es6'],
  })
  .transform(babelify.configure({
      "optional": [
        "runtime"
      ]
    }))
  .require('motu.es6', {entry: true})
  .bundle()
  .pipe(fs.createWriteStream('build/motu.js'))
})

gulp.task('clean', function (cb) {
  del(['build/*'], cb)
})

gulp.task('default', ['clean', 'dev'])

gulp.task('watch', ['dev'], function () {
  gulp.watch('src/**/*.es6', ['dev'])
})
