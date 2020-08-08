const gulp = require("gulp");
const gulpEjsMonster = require("gulp-ejs-monster");
const sass = require("gulp-sass");
const sassGlob = require('gulp-sass-glob');
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const replace = require('gulp-replace');
const flatten = require('gulp-flatten');

// ejs
const templates = function () {
    return gulp
      .src(['src/views/pages/**/*.ejs', '!src/views/pages/**/sections/**/*.ejs', '!src/common/**/*.ejs'])
      .pipe(gulpEjsMonster().on("error", gulpEjsMonster.preventCrash))
      .pipe(rename({ extname: ".html" }))
      .pipe(flatten())
      .pipe(gulp.dest('./public'));
  };

  // sass
const styles = function () {
    return gulp
      .src(['src/styles/main.scss', 'src/views/**/*.scss', 'src/common/**/*.scss'])
      .pipe(sourcemaps.init())
      .pipe(sassGlob())
      .pipe(sass({ errorlogToConsole: true, outputStyle: "compressed" }))
      // .on("error", console.error.bind(console))
      .pipe(concat("app.css"))
      .pipe(rename({ suffix: ".min" }))
      .pipe(replace(/url\(\".*\//g, 'url("images/'))
      .pipe(sourcemaps.write("./maps"))
      .pipe(gulp.dest("./public/styles"))
      .pipe(browserSync.stream());
  };

  //imagemin
const images = function () {
    return gulp
      .src(["src/views/**/**/images/*.{png,jpg,bmp}"])
      .pipe(imagemin())
      .pipe(flatten())
      .pipe(gulp.dest("public/images"));
  };
  
  // browserSync
const sync = function () {
    return browserSync.init({
      server: {
        baseDir: "./public"
      },
      port: 3000
    });
  
  }
  const browserReload = function () {
    return browserSync.reload();
  
  }
  // watchFiles
const watchFiles = function () {
    gulp.watch(['src/styles/main.scss', 'src/views/**/*.scss', 'src/common/**/*.scss'], styles);
    gulp.watch(['src/views/pages/**/**/*.ejs', 'src/views/pages/**/sections/**/*.ejs', 'src/common/**/*.ejs'], templates);
    gulp.watch(['src/views/**/**/images/*.{png,jpg,bmp}'], images);
    gulp.watch("./public/*.html", browserReload);
    gulp.watch("./public/**/*.css", browserReload);
  }
  
  exports.templates = templates;
  exports.styles = styles;
  exports.images = images;
  exports.watchFiles = watchFiles;
  exports.default = gulp.parallel(images, sync, watchFiles);