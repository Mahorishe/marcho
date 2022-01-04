const { src, dest, watch, series, parallel } = require('gulp');
const scss          = require('gulp-sass')(require('sass'));
const concat        = require('gulp-concat');
const autoprefixer  = require('gulp-autoprefixer');
const uglify        = require('gulp-uglify');
const imagemin      = require('gulp-imagemin');
const del           = require('del');
const sync          = require('browser-sync').create();

const browserSync = () => {
  sync.init({
    server: {
      baseDir: 'src/'
    },
    notify: false
  })
}

const styles = () => {
  return src('src/scss/style.scss')
    .pipe(scss({
      outputStyle: 'compressed'
    }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    }))
    .pipe(dest('src/css'))
    .pipe(sync.stream())
}

const scripts = () => {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'src/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('src/js'))
  .pipe(sync.stream())
}

const images = () => {
  return src('src/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        { name: 'removeViewBox', active: true },
        { name: 'cleanupIDs', active: false}
      ]
    })
  ]))
  .pipe(dest('dist/images'))
}

const build = () => {
  return src([
    'src/**/*.html',
    'src/css/style.min.css',
    'src/js/main.min.js'
  ], {base: 'src'})
  .pipe(dest('dist'))
}

const reset = () => {
  return del('dist')
}

const watcher = () => {
  watch(['src/scss/**/*.scss'], styles);
  watch(['src/js/**/*.js', '!src/js/main.min.js'], scripts);
  watch(['src/**/*.html']).on('change', sync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.sync = sync;
exports.images = images;
exports.build = series(reset, images, build);
exports.reset = reset;
exports.watcher = watcher;

exports.default = parallel(styles, scripts, sync, watcher);