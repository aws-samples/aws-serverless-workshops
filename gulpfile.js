const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', () => {
  // place code for your default task here
});
