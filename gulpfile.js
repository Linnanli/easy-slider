var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-clean-css');

gulp.task('default',function(){
    gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));

    gulp.src('src/style/**/*.css')
    .pipe(cssmin())
    .pipe(gulp.dest('dist/style'));
});