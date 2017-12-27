/* DEPENDENCIES */
const gulp = require('gulp');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const gulpIf = require('gulp-if');
const minifyCss = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const rename = require("gulp-rename");

/* GULP SASS */
gulp.task('sass', function() {
    let pathSrc = 'app/models/scss/*.scss';
    let pathDest = 'app/assets/css';
    return gulp.src(pathSrc)
        .pipe(sourcemaps.init())
        .pipe(sass())
        // .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(pathDest));
});

gulp.task('sassVendor', function() {
    let pathSrc = 'app/models/scss/vendor/**/*.scss';
    let pathDest = 'app/assets/css';
    return gulp.src(pathSrc)
        // .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(rename({
            dirname: '',
            // basename: '',
            // prefix: '',
            suffix: '.custom',
            // extname: ''
        }))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(pathDest));
});

/* GULP FILE INCLUDE */
gulp.task('fileinclude', function() {
    let pathSrc = 'app/controllers/*.html';
    let pathDest = 'app';
    return gulp.src(pathSrc)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(pathDest));
});

/* GULP WATCH */
gulp.task('watch', function() {
    let watchSCSS = [
        'app/models/scss/**/*.scss',
        '!app/models/scss/vendor/**/*.scss'
    ];
    let watchSCSSVendor = 'app/models/scss/vendor/**/*.scss';
    let watchHTML = [
        'app/views/**/*.html',
        'app/controllers/**/*.html'
    ];
    let watchJS = 'app/assets/js/*.js';
    gulp.watch(watchSCSS, function() {
        runSequence('sass', browserSync.reload);
    });
    gulp.watch(watchSCSSVendor, function() {
        runSequence('sassVendor', browserSync.reload);
    });
    gulp.watch(watchHTML, function() {
        return runSequence('fileinclude', browserSync.reload);
    });
    gulp.watch(watchJS, browserSync.reload);
});

/* BROWSER SYNC */
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        // port: 80
    });
});

/* DEL TRASH */
gulp.task('del', function() {
    let pathDel = [
        'app/assets/css/*.map',
        'app/*.html',
        'dist'
    ];
    del(pathDel);
});

/* GULP MOVE ASSETS */
gulp.task('move', function() {
    let pathSrc = [
        'app/assets/fonts/*',
        'app/assets/images/*',
        'app/assets/css/main.css'
    ]
    let pathDest = [
        'dist/assets/fonts',
        'dist/assets/images',
        'dist/assets/css'
    ]
    let len = pathSrc.length;
    for (let i = 0; i < len; i++) {
        gulp.src(pathSrc[i])
            .pipe(gulp.dest(pathDest[i]));
    }
});

/* GULP USEREF */
gulp.task('useref', function() {
    let pathSrc = 'app/*.html';
    let pathDest = 'dist';
    return gulp.src(pathSrc)
        .pipe(useref())
        .pipe(gulpIf('*.css', minifyCss()))
        // .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest(pathDest));
});

/* GULP DEFAULT */
gulp.task('default', function() {
    runSequence('del', 'sassVendor', 'sass', 'fileinclude', 'browserSync', 'watch');
});

/* GULP BUILD */
gulp.task('build', function() {
    runSequence('del', 'sassVendor', 'fileinclude', 'move', 'useref', 'browserSync', 'watch');
});


/* ********************************* SUPPORT KOALA ********************************* */

/* GULP KOALA WATCH */
gulp.task('watchKoala', function() {
    let watchCSS = 'app/assets/css/*.css';
    let watchSCSSVendor = 'app/models/scss/vendor/**/*.scss';
    let watchHTML = [
        'app/views/**/*.html',
        'app/controllers/**/*.html'
    ];
    let watchJS = 'app/assets/js/*.js';
    gulp.watch(watchCSS, browserSync.reload);
    gulp.watch(watchSCSSVendor, function() {
        runSequence('sassVendor', browserSync.reload);
    });
    gulp.watch(watchHTML, function() {
        return runSequence('fileinclude', browserSync.reload);
    });
    gulp.watch(watchJS, browserSync.reload);
});

/* GULP KOALA */
gulp.task('koala', function() {
    runSequence('del', 'sassVendor', 'sass', 'fileinclude', 'browserSync', 'watchKoala');
});