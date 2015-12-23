var gulp = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");

var bSync = require("browser-sync");
var jshintStylish = require("jshint-stylish");

var g = gulpLoadPlugins({
	rename: {
		"gulp-file-contents-to-json": "fc2json"
	}
});

var browserSync;

gulp.task("default", ["watch"]);

gulp.task("build", function(done) {
	g.sequence(["build-scripts", "build-styles", "build-views"])(done);
});

gulp.task("build-scripts", function(done) {

	var pipeline = gulp.src("src/scripts/*.js")
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

	if(browserSync)
		pipeline.pipe(browserSync.reload());

	done();
});

gulp.task("build-styles", function(done) {
	var pipeline = gulp.src("src/styles/*.scss")
		.pipe(g.plumber())
		.pipe(g.sass())
			.pipe(gulp.dest("app/styles"));

	if(browserSync)
		pipeline.pipe(browserSync.reload({ stream: true }));

	done();
});

gulp.task("build-views", function(done) {
	var pipeline = gulp.src("src/views/*")
		.pipe(g.plumber())
		.pipe(g.fc2json("views.json"))
		.pipe(gulp.dest("app/data/"));

	if(browserSync)
		pipeline.pipe(browserSync.reload());

	done();
});

gulp.task("serve", function() {
	browserSync = bSync.create();
	browserSync.init({
		server: {
			baseDir: "./app"
		}
	});	
});

gulp.task("reload", function() {
	browserSync.reload();
});

gulp.task("watch", function(done) {
	g.sequence("build", ["serve", "run-watch"])(done);
});

gulp.task("run-watch", function() {
	gulp.watch("app/index.html", ["reload"]);
	gulp.watch("src/scripts/*.js", ["build-scripts"]);
	gulp.watch("src/styles/*.scss", ["build-styles"]);
	gulp.watch("src/views/*", ["build-views"]);
});
