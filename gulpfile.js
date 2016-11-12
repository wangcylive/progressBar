/**
 * Created by wangcy on 2016/1/9.
 */
var gulp = require("gulp");
var uglify = require("gulp-uglify");
var cssnano = require("gulp-cssnano");
var rename = require("gulp-rename");


gulp.task("default", function() {
    gulp.src("./src/progress-bar.js")
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += ".min"
        }))
        .pipe(gulp.dest("./src"));
});