'use strict';

var config = {
	paths: {
		scripts: ['app/scripts/*.js'],
		images: [],
		css: ['app/css/*.css']
	}
};

// Load plugins w/out 'gulp-' prefix
var gulp = require('gulp');
var open = require('open');
var wiredep = require('wiredep').stream;
var ngrok = require('ngrok');
var stylish = require('jshint-stylish');
var help = require('gulp-task-listing');

// Load plugins w/ 'gulp-' prefix
var $ = require('gulp-load-plugins')();

// List all gulp tasks
gulp.task('help', function(){
	help();
});

// Open ngrok tunnel
gulp.task('ngrok', function() {
	ngrok.connect(9000, function(err, url) {
		console.log(err);
		// Show ngrok tunnel url
		$.util.log('Localhost tunnel running at ' + $.util.colors.red(url));
	});
});

// Styles
gulp.task('styles', function () {
	return gulp.src(config.paths.css)
		.pipe($.autoprefixer('last 1 version'))
		.pipe(gulp.dest('app/css'))
		.pipe($.size());
});

// Scripts
gulp.task('scripts', function () {
	return gulp.src(config.paths.scripts)
		.pipe($.jshint('.jshintrc'))
		.pipe($.jshint.reporter(stylish))
		.pipe($.size());
});

// HTML
gulp.task('html', ['styles', 'scripts'], function () {
	var jsFilter = $.filter('**/*.js');
	var cssFilter = $.filter('**/*.css');

	return gulp.src('app/*.html')
		.pipe($.useref.assets())
		.pipe(jsFilter)
		.pipe($.uglify({outSourceMap: true}))
		.pipe(jsFilter.restore())
		.pipe(cssFilter)
		.pipe($.csso())
		.pipe(cssFilter.restore())
		.pipe($.useref.restore())
		.pipe($.useref())
		.pipe(gulp.dest('dist'))
		.pipe($.size());
});

// Images
gulp.task('images', function () {
	return gulp.src('app/images/**/*')
		.pipe($.cache($.imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
		.pipe($.size());
});

// Clean
gulp.task('clean', function () {
	return gulp.src(['dist/css', 'dist/scripts', 'dist/images'], { read: false }).pipe($.clean());
});

// Build
gulp.task('build', ['html', 'images']);

// Default task
gulp.task('default', ['clean'], function () {
	gulp.start('build');
});

// Connect dev server
gulp.task('connectDev', $.connect.server({
	root: ['app'],
	port: 9000,
	livereload: true
}));

// Start dev server, open browser tab
gulp.task('serve', ['connectDev', 'ngrok'], function() {
	open("http://localhost:9000");
});

// Inject Bower components
gulp.task('wiredep', function () {
	gulp.src('app/styles/*.css')
		.pipe(wiredep({
			directory: 'app/bower_components',
			ignorePath: 'app/bower_components/'
		}))
		.pipe(gulp.dest('app/styles'));

	gulp.src('app/*.html')
		.pipe(wiredep({
			directory: 'app/bower_components',
			ignorePath: 'app/'
		}))
		.pipe(gulp.dest('app'));
});

// Watch
gulp.task('watch', ['serve'], function () {
	// Watch for changes in `app` folder
	gulp.watch([
		'app/*.html',
		'app/css/**/*.css',
		'app/scripts/**/*.js',
		'app/images/**/*',
		'app/modules/**/*',
		'app/partials/**/*'
	], function (event) {
		console.log(event);
		return gulp.src(event.path)
			.pipe($.connect.reload());
	});

	// Watch .css files
	gulp.watch('app/css/**/*.css', ['styles']);

	// Watch .js files
	gulp.watch(config.paths.scripts, ['scripts']);

	// Watch image files
	gulp.watch('app/images/**/*', ['images']);

//	// Watch bower files
//	gulp.watch('bower.json', ['wiredep']);
});