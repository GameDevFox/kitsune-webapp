var gulp = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");

var browserSync = require("browser-sync").create();
var jshintStylish = require("jshint-stylish");

var g = gulpLoadPlugins({
	rename: {
		"gulp-file-contents-to-json": "fc2json"
	}
});

gulp.task("default", ["watch"]);

gulp.task("build", function(done) {
	g.sequence(["build-scripts", "build-styles", "build-views"])(done);
});

gulp.task("build-scripts", function() {

	return gulp.src("src/scripts/*.js")
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

gulp.task("build-views", function() {
	return gulp.src("src/views/*")
		.pipe(g.plumber())
		.pipe(g.fc2json("views.json"))
		.pipe(gulp.dest("app/data/"));
});

gulp.task("serve", function() {
	browserSync.init({
		server: {
			baseDir: "./app"
		}
	});
});

gulp.task("reload", function() {
	browserSync.reload();
});

gulp.task("scripts-reload", ["build-scripts"], function() {
	browserSync.reload();
});

gulp.task("views-reload", ["build-views"], function() {
	browserSync.reload();
});

gulp.task("watch", function(done) {
	g.sequence("build", ["serve", "run-watch"])(done);
});

gulp.task("run-watch", function() {
	gulp.watch("app/index.html", browserSync.reload);
	gulp.watch("src/scripts/*.js", ["scripts-reload"]);
	gulp.watch("src/styles/*.scss", ["build-styles"]);
	gulp.watch("src/views/*", ["views-reload"]);
});
