var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var del = require('del');
var runSequence = require('run-sequence');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify-es').default;
var cssnano = require('gulp-cssnano');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
    })
});

gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/**/*.js', browserSync.reload);
});

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
          .pipe(gulpIf('*.js', uglify()))
          .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('./'))
});

gulp.task('clean', function () {
    return del.sync(['js', 'css']);
});

gulp.task('default', ['sass', 'browserSync', 'watch']);

gulp.task('build', function (callback) {
    runSequence('clean', 'sass', 'useref',
        callback
    )
});