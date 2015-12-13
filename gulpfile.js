var gulp = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");

var browserSync = require("browser-sync").create();

var $ = gulpLoadPlugins();

gulp.task("default", function() {
	browserSync.init({
		server: {
			baseDir: "./app"
		}
	});
});

gulp.task("styles", function() {
	gulp.src("src/styles/*.scss")
		.pipe($.sass())
		.pipe(gulp.dest("app/styles"));
});
