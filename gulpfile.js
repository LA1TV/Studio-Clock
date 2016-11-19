const gulp = require('gulp');
const concat = require('gulp-concat');

gulp.task('build', () => {
  return gulp.src([
    './node_modules/pixi.js/dist/pixi.js',
    './app/app.js'
  ])
  .pipe(concat('clock.js'))
  .pipe(gulp.dest('./public/js/'));
});

gulp.task('default', ['build']);