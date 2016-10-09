import loadPlugins from 'rollup-load-plugins'
import {minify} from 'uglify-js'

const $ = loadPlugins()
const esSources = ['src/**']

export default (entry, debug) => ({
  entry,
  format: 'iife',
  moduleName: 'Motu',
  sourceMap: debug,
  plugins: [
    $.nodeBuiltins(),
    $.babel({
      babelrc: false,
      presets: ['es2015-loose-rollup'],
      plugins: ['async-to-promises'],
      include: esSources
    }),
    $.nodeResolve({
      jsnext: false,
      main: true,
      preferBuiltins: true,
      browser: true
    }),
    $.commonjs({
      ignoreGlobal: true,
      exclude: esSources
    }),
    $.nodeGlobals()
    // debug ? {} : $.uglify({}, minify)
  ]
})
