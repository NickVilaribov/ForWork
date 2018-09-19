var syntax        = 'sass'; // Syntax: sass or scss;

var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		rigger        = require('gulp-rigger'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require("gulp-notify"),
		rsync         = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('app/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	//.pipe(cleancss()) // Opt., comment out when debugging
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream())
});

gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/owl.carousel/dist/owl.carousel.min.js',
		'app/libs/jqBootstrapValidation/dist/jqBootstrapValidation-1.3.7.min.js',
		'app/libs/jquery-nice-select/js/jquery.nice-select.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('build:html', function () {
    gulp.src('app/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({ stream: true }))
});
gulp.task('build:img', function() {
    gulp.src('app/img/**/*.*')
        .pipe(gulp.dest('build/img'))
        .pipe(browserSync.reload({ stream: true }))
});
gulp.task('build:fonts', function() {
    gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'))
        .pipe(browserSync.reload({ stream: true }))
});
gulp.task('build:libs', function() {
    gulp.src('app/libs/**/*.*')
        .pipe(gulp.dest('build/libs'))
        .pipe(browserSync.reload({ stream: true }))
});
gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('watch', ['styles', 'js', 'build:html', 'build:img', 'build:fonts', 'build:libs', 'browser-sync'], function() {
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['styles']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/img/**/*.*', ['build:img']);
	gulp.watch('app/fonts/**/*.*', ['build:fonts']);
	gulp.watch('app/libs/**/*.*', ['build:libs']);
	gulp.watch(['app/template/*.html', 'app/*.html'],  ['build:html']);
	gulp.watch('app/*.html', browserSync.reload)
});

gulp.task('default', ['watch']);
