var gulp = require('gulp');
var sass = require('gulp-sass');
var bs = require('browser-sync').create();

gulp.task('browser-sync', ['sass'], function(){
  bs.init ({
    proxy: {
      target: "localhost:8080" // can be [virtual host, sub-directory, localhost with port]
    }
  });
});

gulp.task('sass', function(){
  return (gulp.src('public/sass/main.scss'))
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(bs.reload({stream:true}));
});

gulp.task('prod', function(){
  return (gulp.src('public/sass/main.scss'))
    .pipe(sass())
    .pipe(gulp.dest('public/css'));
});

gulp.task('watch',['browser-sync'], function(){
  gulp.watch('public/sass/**/*.scss', ['sass']);
  gulp.watch('views/*.ejs').on('change', bs.reload);
});
