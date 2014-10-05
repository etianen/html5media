"use strict";

var meta = require("./package.json");
var path = require("path");
var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var clean = require("gulp-clean");
var minifyCSS = require("gulp-minify-css");
var replace = require("gulp-replace");
var shell = require("gulp-shell");


var API_JS_BUILD_ROOT = path.join("build", "api", meta.version);


// Cleaning.

gulp.task("clean", function() {
    return gulp.src([
        "build"
    ], {
        "read": false
    })
    .pipe(clean());
});


// Building.

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
        "src/lib/flowplayer/flowplayer.swf",
        "src/lib/flowplayer/flowplayer.controls.swf",
        "src/lib/flowplayer.audio/flowplayer.audio.swf",
        "src/lib/swfobject/expressInstall.swf"
    ])
    .pipe(gulp.dest(API_JS_BUILD_ROOT));
});


gulp.task("api-license", function() {
    return gulp.src([
        "LICENSE",
    ])
    .pipe(gulp.dest(API_JS_BUILD_ROOT));
});


gulp.task("api", ["api-js", "api-swf", "api-license"]);


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


function injectHtml(stream)  {
    return stream
    // Fix api paths.
    .pipe(replace(/\.\.\/api\//g, "//api.html5media.info/" + meta.version + "/"))
    // Fix media paths.
    .pipe(replace(/\.\.\/media\//g, "//media.html5media.info/"))
    // Use minified js.
    .pipe(replace(/html5media\.js/g, "html5media.min.js"))
    // Use minified css.
    .pipe(replace(/styles\.css/g, "styles.min.css"));
}


gulp.task("www-html", ["api"], function() {
    return injectHtml(gulp.src([
        "src/www/*.html"
    ]))
    .pipe(gulp.dest("build/www"));
});


gulp.task("www", ["www-html"]);


gulp.task("common-misc", function() {
    return gulp.src([
        "src/common/*.txt",
        "src/common/*.xml"
    ])
    .pipe(gulp.dest("build/api"))
    .pipe(gulp.dest("build/media"))
    .pipe(gulp.dest("build/www"));
});


gulp.task("common-html", ["api"], function() {
    return injectHtml(gulp.src([
        "src/common/*.html"
    ]))
    .pipe(gulp.dest("build/api"))
    .pipe(gulp.dest("build/media"))
    .pipe(gulp.dest("build/www"));
});


gulp.task("common", ["common-misc", "common-html"]);


gulp.task("build", ["api", "media", "www", "common"]);


// Distributing.

gulp.task("dist", ["build"], function() {
    return gulp.src([
        "build/**",
    ])
    .pipe(gulp.dest("dist/"));
});


// Publishing.

var publishViaRsync = function(src, dest) {
    return "rsync -rh --progress --delete " + src + " " + process.env.HTML5MEDIA_HOST + ":" + dest;
};


gulp.task("publish-www", ["dist"], shell.task([
    publishViaRsync("dist/www/*", process.env.HTML5MEDIA_PATH_WWW),
]));


gulp.task("publish-media", ["dist"], shell.task([
    publishViaRsync("dist/media/*", process.env.HTML5MEDIA_PATH_MEDIA),
]));


gulp.task("publish-api", ["dist"], shell.task([
    publishViaRsync("dist/api/*", process.env.HTML5MEDIA_PATH_API),
]));


gulp.task("publish", ["publish-www", "publish-media", "publish-api"]);
