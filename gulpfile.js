"use strict";

var meta = require("./package.json");
var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var concat = require("gulp-concat");


var API_BUILD_ROOT = "build/api/" + meta.version;


gulp.task("api-js", function() {
    return gulp.src([
        "lib/flowplayer/flowplayer.js",
        "lib/domready/domready.js",
        "src/api/html5media.js",
    ])
    .pipe(concat("html5media.js"))
    .pipe(gulp.dest(API_BUILD_ROOT))
    .pipe(uglify())
    .pipe(rename("html5media.min.js"))
    .pipe(gulp.dest(API_BUILD_ROOT));
});
