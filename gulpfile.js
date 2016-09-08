var gulp = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");

var browserSync = require("browser-sync").create();
var jshintStylish = require("jshint-stylish");
var wiredep = require("wiredep").stream;
let del = require("del");

var g = gulpLoadPlugins({
    rename: {
        "gulp-file-contents-to-json": "fc2json"
    }
});

gulp.task("clean", function() {
    del("./app");
});

gulp.task("default", ["build"]);

gulp.task("build", ["build-html", "build-scripts", "build-styles", "build-templates", "build-views"]);

gulp.task("build-html", ["build-scripts"], function() {
    return gulp.src("./src/index.html")
        .pipe(wiredep({ ignorePath: "../" }))
        .pipe(g.inject(gulp.src("./app/scripts/**/*.js"), { ignorePath: "../app", relative: true }))
        .pipe(gulp.dest("./app"));
});

gulp.task("build-scripts", function() {
    return gulp.src("src/scripts/**/*.js")
        .pipe(g.cached("build"))
        .pipe(g.plumber())
        .pipe(g.debug({ title: "build" }))
        // .pipe(g.jshint({ esnext: true }))
        // .pipe(g.jshint.reporter(jshintStylish))
        // .pipe(g.jshint.reporter("fail"))
        .pipe(g.sourcemaps.init())
        .pipe(g.babel({ presets: ["es2015"], /*, optional: ["runtime"]*/ }))
        .pipe(g.sourcemaps.write())
        .pipe(gulp.dest("./app/scripts"));
});

gulp.task("build-styles", function() {
    return gulp.src("src/styles/*.scss")
        .pipe(g.plumber())
        .pipe(g.sass())
        .pipe(gulp.dest("app/styles"))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("build-templates", function() {
    return gulp.src("src/templates/*")
        .pipe(gulp.dest("app/templates/"));
});

gulp.task("build-views", function() {
    return gulp.src("src/views/*")
        .pipe(g.plumber())
        .pipe(g.fc2json("views.json"))
        .pipe(gulp.dest("app/data/"));
});

gulp.task("serve", ["build"], function() {
    gulp.start("run-watch");
    browserSync.init({
        files: "./app",
        server: {
            baseDir: "./app",
            routes: {
                "/bower_components": "./bower_components"
            }
        }
    });
});

gulp.task("watch", ["build"], function(done) {
    gulp.run("run-watch");
});

gulp.task("run-watch", function() {
    gulp.watch("src/index.html", ["build-html"]);
    gulp.watch("src/scripts/**/*.js", ["build-scripts"]);
    gulp.watch("src/styles/*.scss", ["build-styles"]);
    gulp.watch("src/templates/*", ["build-templates"]);
    gulp.watch("src/views/*", ["build-views"]);
});
