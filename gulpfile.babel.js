import gulp from 'gulp'
import path from 'path'
import gulpif from 'gulp-if'
import gutil from 'gulp-util'
import del from 'del'
import merge from 'lodash.merge'
import runSequence from 'run-sequence'
import eslint from 'gulp-eslint'
import nodemon from 'gulp-nodemon'
import webpack from 'webpack'
import WebpackServer from 'webpack-hot-server'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const {
  NODE_ENV = 'production',
  HOST = 'localhost',
  PORT = 9000,
  WEBPACK_PORT = 3000
} = process.env

const isProd = NODE_ENV === 'production'

const fullPath = (...paths) => path.join(__dirname, ...paths)

const deepMergeClone = (...sources) => merge({}, ...sources, (a, b) => {
  if (Array.isArray(a)) {
    return b.concat(a)
  }
})

const paths = {
  js:    './client',
  scss:  './src/scss',
  entry: './client/app.js',
  output: 'public',
  dist:   './dist'
}

function generateWebpackConfig(env) {

  const webpackBaseConfig = {
    entry: [paths.entry],
    output: {
      path: fullPath(paths.dist, paths.output),
      filename: 'bundle.js',
      pathinfo: !isProd
    },
    module: {
      loaders: [{
        test: /.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        include: fullPath(paths.js)
      }, {
        test: /.json$/,
        loader: 'json'
      }]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(NODE_ENV)
        }
      }),
      new webpack.NoErrorsPlugin()
    ],
    resolve: {
      root: fullPath(paths.js),
      extensions: ['', '.js', '.json']
    }
  }

  switch (env) {
    case 'development':
      const webpackDevConfig = deepMergeClone(webpackBaseConfig, {
        devtool: 'cheap-module-eval-source-map',
        debug: true,
        entry: [`webpack-hot-server/client?path=http://${HOST}:${WEBPACK_PORT}/__webpack_hmr`],
         output: {
          publicPath: `http://${HOST}:${WEBPACK_PORT}/${paths.output}/`
        },
        plugins: [
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.HotModuleReplacementPlugin()
        ],
        module: {
          loaders: [
            // {
            //   test: /\.scss$/,
            //   loader: 'style!css!autoprefixer!sass?includePaths[]=' + fullPath(paths.scss)
            // }
          ]
        }
      })
      return webpackDevConfig
    case 'production':
    default:
      const webpackProdConfig = deepMergeClone(webpackBaseConfig, {
        plugins: [
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin(),
          // new ExtractTextPlugin('styles.css')
        ],
        module: {
          loaders: [
            // {
            //   test: /\.scss$/,
            //   loader: ExtractTextPlugin.extract('css!autoprefixer!sass?includePaths[]=' + fullPath(paths.scss))
            // }
          ]
        }
      })
      return webpackProdConfig
  }
}

const webpackConfig = generateWebpackConfig(NODE_ENV)

gulp.task('clean', (callback) => {
  del([
    paths.dist
  ], callback)
})

gulp.task('lint', () => {
  return gulp.src(paths.js)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(gulpif(isProd, eslint.failOnError()))
})

gulp.task('webpack', (callback) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({colors: false}))
    callback()
  })
})

gulp.task('webpack-server', () => {
  new WebpackServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    contentBase: fullPath(paths.dist),
    hot: !isProd,
    stats: true
  }).listen(WEBPACK_PORT, HOST, (err) => {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack-server]', 'listening on', gutil.colors.cyan(`http://${HOST}:${WEBPACK_PORT}`))
  })
})

gulp.task('server', () => {
  nodemon({
    script: './index.js',
    ext: 'js',
    ignore: [`${paths.js}/`, './node_modules/', 'gulpfile.babel.js', 'package.json'],
    env: process.env
  })
})

gulp.task('watch', () => {
  gulp.watch(paths.js, ['lint'])
})

gulp.task('prepare', function(callback) {
  runSequence('clean', callback)
})

gulp.task('build', ['prepare', 'lint'])

gulp.task('dev', function(callback) {
  runSequence('build', 'server', 'webpack-server', 'watch', callback)
})

gulp.task('default', (callback) => {
  runSequence('build', 'webpack', callback)
})
