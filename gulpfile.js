const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
  
const { series } = require('gulp');

// Compile SCSS to CSS
function css(){
  return gulp
  .src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.stream())
};

function autoprefix(){
  return gulp
  .src('./assets/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer('last 2 versions') ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/css/'))
};

// Optimize Images
function images() {
  return gulp
    .src("./src/images/**/*")
    // .pipe(newer("./images"))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest("./images"));
};


// Watch files for changes
function watch() {
  gulp.watch('src/scss/**/*.scss', series(css, autoprefix))
  browserSync.reload;
};



exports.css = css;
exports.watch = watch;
exports.images = images;
exports.autoprefix = autoprefix;
exports.build = series(css, autoprefix);