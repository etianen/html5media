"use strict";

var meta = require("./package.json");
var path = require("path");
var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var clean = require("gulp-clean");
var inject = require("gulp-inject");
var minifyCSS = require("gulp-minify-css");


var API_JS_BUILD_ROOT = path.join("build", "api", meta.version);


gulp.task("clean", function() {
    return gulp.src([
        "build"
    ], {
        "read": false
    })
    .pipe(clean());
});


gulp.task("api-js", function() {
    return gulp.src([
        "src/lib/flowplayer/flowplayer.js",
        "src/lib/domready/domready.js",
        "src/api/html5media.js"
    ])
    .pipe(concat("html5media.js"))
    .pipe(gulp.dest(API_JS_BUILD_ROOT))
    .pipe(uglify())
    .pipe(rename("html5media.min.js"))
    .pipe(gulp.dest(API_JS_BUILD_ROOT));
});


gulp.task("api-swf", function() {
    return gulp.src([
        "lib/flowplayer/flowplayer.swf",
        "lib/flowplayer/flowplayer.controls.swf",
        "lib/flowplayer.audio/flowplayer.audio.swf",
        "lib/swfobject/expressInstall.swf"
    ])
    .pipe(gulp.dest(API_JS_BUILD_ROOT));
});


gulp.task("api", ["api-js", "api-swf"]);


gulp.task("media-css", function() {
    return gulp.src([
        "src/media/styles.css"
    ])
    .pipe(gulp.dest("build/media"))
    .pipe(minifyCSS({
        compatibility: "ie8"
    }))
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("build/media"));
});


gulp.task("media-static", function() {
    return gulp.src([
        "src/media/*",
        "!src/media/*.css",
    ])
    .pipe(gulp.dest("build/media"));
});


gulp.task("media", ["media-static", "media-css"]);


gulp.task("www", ["api"], function() {
    return gulp.src([
        "./src/www/*.html"
    ])
    .pipe(inject(gulp.src([
        path.join(API_JS_BUILD_ROOT, "html5media.min.js"),
        "build/media/styles.min.css"
    ], {
        read: false
    }), {
        ignorePath: "/build",
        addRootSlash: false,
        addPrefix: ".."
    }))
    .pipe(gulp.dest("build/www"));
});


gulp.task("build", ["api", "media", "www"]);


gulp.task("dist", ["build"], function() {
    return gulp.src([
        "build/**",
    ])
    .pipe(gulp.dest("dist/"));
});
