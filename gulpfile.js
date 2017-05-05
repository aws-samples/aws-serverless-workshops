const gulp = require('gulp');

const eslint = require('gulp-eslint');

const LINT_GLOBS = [
    '**/*.js',
    '!node_modules/**',
    '!**/*vendor*.js',
    '!**/vendor/**',
];

gulp.task('lint', () => gulp.src(LINT_GLOBS)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError()));

gulp.task('default', ['lint']);
