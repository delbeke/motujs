import gulp from 'gulp'
import loadPlugins from 'gulp-load-plugins'
import del from 'del'
import seq from 'run-sequence'
import rollup from 'rollup-stream'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import path from 'path'
import createRollupConfig from './rollup/config-factory'

const buildPath = 'dist'

const $ = loadPlugins()

const createRollupTask = (debug) => () => {
  const jsPath = 'src'
  const entryFile = 'motu.js'
  const entryPath = path.join(jsPath, entryFile)
  const outputFile = 'motu' + (debug ? '-debug' : '') + '.js'
  const config = createRollupConfig(entryPath, debug)
  return rollup(config)
    .pipe(source(entryFile, jsPath))
    .pipe($.if(debug, $.sourcemaps.write()))
    .pipe(buffer())
    .pipe($.rename(outputFile))
    .pipe(gulp.dest(buildPath))
}

gulp.task('clean', () => del(buildPath))

gulp.task('build:release', createRollupTask(false))

gulp.task('build:debug', createRollupTask(true))

gulp.task('build', (cb) => seq('clean', ['build:release', 'build:debug', 'build:lib'], cb))

gulp.task('build:lib', () => {
  return gulp.src('src/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('lib'))
})

gulp.task('lint', () => {
  return gulp.src('src/**/*.js')
    .pipe($.standard())
    .pipe($.standard.reporter('default', {
      breakOnError: false
    }))
})

gulp.task('watch', () => gulp.watch('{src,examples}/**/*', ['build']))

gulp.task('default', ['build'], () => gulp.start('watch'))
