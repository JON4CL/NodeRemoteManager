// grab our gulp packages
var gulp = require('gulp');
var gutil = require('gulp-util');

// create a default task and just log a message
gulp.task('default', function() {
  return gutil.log('Gulp is running!');
});

gulp.task('mytask', function() {
  //do stuff
});

gulp.task('dependenttask', ['mytask'], function() {
  //do stuff after 'mytask' is done.
});

gulp.task('copyHtml', function() {
  // copy any html files in source/ to public/
  gulp.src('source/*.html').pipe(gulp.dest('public'));
});