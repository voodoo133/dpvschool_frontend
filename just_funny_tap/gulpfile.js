"use strict";

/* Сборка CSS */
var sass = require('gulp-sass');
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");

/* Сжатие скриптов */
var uglify = require('gulp-uglify-es').default;

/* Вспомогательные модули */
var del = require("del");
var rename = require("gulp-rename");
var concat = require('gulp-concat');

/* Основа */
var gulp = require("gulp");
var server = require("browser-sync").create();

gulp.task("clean-build", function () {
  return del("build");
});

gulp.task("copy-files", function () {
  return gulp.src([
      "src/img/**",
      "src/*.html",
      "src/*.json"
    ], {
      base: "src"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("make-css", function () {
  return gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("minify-js", function () {
  return gulp.src([
      "src/js/*.js", "!src/js/*.min.js"
    ])
    .pipe(plumber())
    .pipe(concat('script.js'))
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"));
});

gulp.task("make-build", gulp.series(
  "clean-build",
  "copy-files",
  "make-css",
  "minify-js"
));

gulp.task("run-server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/sass/*.scss", gulp.series("make-css"));
  gulp.watch([ "src/*.html", "src/*.json" ], gulp.series("copy-files", "refresh-server"));
  gulp.watch("src/js/*.js", gulp.series("minify-js", "refresh-server"));
});

gulp.task("refresh-server", function (done) {
  server.reload();
  done();
});

gulp.task("start", gulp.series(
  "make-build",
  "run-server"
));
