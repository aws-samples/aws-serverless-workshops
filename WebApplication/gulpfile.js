const gulp = require('gulp');
const eslint = require('gulp-eslint');
const print = require('gulp-print');

gulp.task('lint', () => {
    gulp.src(['**/*.js', '!node_modules/**', '!**/vendor/**', '!**/website/js/vendor.js', '!**/website/js/main.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('upload', () => {
    gulp.src(['1_StaticWebHosting/website/**', '**/*.yaml']).pipe(print());
});

gulp.task('default', () => {
    gulp.src(['**/*.js', '!node_modules/**', '!**/vendor/**', '!**/website/js/vendor.js']).pipe(print());
});
