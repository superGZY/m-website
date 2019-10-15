const path = require('path')
const { src, dest, series, parallel, watch } = require('gulp')
const connect = require('gulp-connect')
const sass = require('gulp-sass')
const webpack = require('webpack-stream')
const proxy = require('http-proxy-middleware')

// copyhtml
function copyhtml() {
  return src('./src/*.html')
    .pipe(dest('./dev/'))
    .pipe(connect.reload())
}

// copylibs
function copylibs() {
  return src('./src/libs/**/*')
    .pipe(dest('./dev/libs'))
}

// copylibs
function copyassets() {
  return src('./src/assets/**/*')
    .pipe(dest('./dev/assets'))
}

// 编译sass
function packSCSS() {
  return src(['./src/styles/**/*.scss', '!./src/styles/yo/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./dev/styles/'))
    .pipe(connect.reload())
}

// JS模块化
function packJS() {
  return src('./src/scripts/*.js')
    .pipe(webpack({
      mode: 'development',
      entry:{
        app:'./src/scripts/app.js',
        'app-login':'./src/scripts/app-login.js',
        'app-res':'./src/scripts/app-res.js'
      },
      output: {
        path: path.resolve(__dirname, './dev'),
        filename: '[name].js'
      },
      module: {
        rules: [
          {
            test: /\.html$/,
            loader: 'string-loader'
          },
          {
            test: /\.art$/,
            loader: "art-template-loader"
          }
        ]
      }
    }))
    .pipe(dest('./dev/scripts'))
    .pipe(connect.reload())
}

// 启动server
function gulpServer() {
  return connect.server({
    name: 'Dist App',
    root: './dev',
    port: 8000,
    host: '10.9.49.176',
    livereload: true,
    middleware: () => {
      return [
        proxy('/api', {
          target: 'http://m.maoyan.com',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        })
      ]
    }
  })
}

// watch
function watchFiles() {
  watch('./src/*.html', series(copyhtml))
  watch('./src/libs/*', series(copylibs))
  watch('./src/**/*', series(packJS))
  watch('./src/**/*.scss', series(packSCSS))
  watch('./src/assets/*', series(copyassets))
}

exports.default = series(parallel(copyhtml, copyassets, copylibs, packSCSS, packJS), parallel(gulpServer, watchFiles))