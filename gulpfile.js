const fileinclude = require("gulp-file-include");
var cssmin = require("gulp-cssmin");
var rename = require("gulp-rename");
const gulp = require("gulp");
var uglifycss = require("gulp-uglifycss");
var importCss = require("gulp-import-css");
const sass = require("gulp-sass")(require("sass"));
const minify = require("gulp-minify");
var webServer = require("gulp-server-livereload");
var plumber = require('gulp-plumber'); // prevent server craching when get an error
gulp.task("import", function (done) {
  gulp.src(["src/js/index.js"]).pipe(minify()).pipe(gulp.dest("dist"));
  done();
});
gulp.task("fonts", function (done) {
  gulp.src(["src/fonts/**"]).pipe(minify()).pipe(gulp.dest("dist/fonts"));
  done();
});
gulp.task("assets", function (done) {
  gulp.src(["src/assets/**"]).pipe(minify()).pipe(gulp.dest("dist/assets"));
  done();
});
gulp.task("include",function (done) {
  gulp
    .src(["src/index.html","includes/**.html"])
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("./dist"));
  done();
});

gulp.task("css", function (done) {
  gulp
    .src("src/styles/index.css")
    .pipe(importCss())
    .pipe(cssmin())
    // .pipe(rename({ suffix: ".min" }))
    .pipe(
      uglifycss({
        maxLineLen: 80,
        uglyComments: true,
      })
    )
    .pipe(gulp.dest("dist"));
  done();
});

gulp.task("scss", function (done) {
  gulp
    .src("./src/scss/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("./dist/scss"));

  done();
});

gulp.task("webserver", function () {
  gulp.src("dist").pipe(
    webServer({
      enable: true,
      livereload: true,
      //  directoryListing: true,
     
      open: true,
      port: 8888,
    })
  );
});
gulp.task("bootstrap", function (done) {
  gulp.src(["src/bootstrap/**"]).pipe(gulp.dest("dist/bootstrap"));
  done();
});

gulp.task("watch", function (done) {
  gulp.series(
    gulp.task("import"),
    gulp.task("bootstrap"),
    gulp.task("include"),
    gulp.task("css"),
    gulp.task("scss"),
    gulp.task("assets"),
    gulp.task("fonts"),
    gulp.task("webserver"),
  )(); // call all tasks for the first time

  gulp.watch(
    ["src/**"],
    gulp.series("include", "css", "scss", "import","fonts","assets"),
    function (file) {
     
    }
  );
  done();
});
