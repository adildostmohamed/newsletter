var gulp = require('gulp');
var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var reload = bs.reload;
var concat = require('gulp-concat');
var order = require('gulp-order');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('browser-sync', ['sass'], function(){
  bs.init ({
    proxy: {
      target: "localhost:8080" // can be [virtual host, sub-directory, localhost with port]
    }
  });
});

//sass task which looks at the main.scss file and then runs the sass compilation task where it is compressed, then adds inline sourcemaps, then uses autoprefixer to add in default browser extension, places it in the dist folder and then launches browsersync to inject the styles
gulp.task('sass', function(){
  return (gulp.src('public/src/sass/main.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest('public/dist/css'))
    .pipe(reload({stream: true}));
});

//js task which looks at all files in the js folder with extension .js, and then uses the order function to concat those files in a specified order, starting with vendor files and then custom files before making them into one file, minifying and then moving to dist
gulp.task('js', function(){
  return (gulp.src('public/src/js/**/*.js'))
  .pipe(order(['vendor/jquery.min.js','vendor/bootstrap.min.js','vendor/moment.min.js','vendor/*.js', 'custom/*.js']))
  .pipe(concat('main.js'))
  .pipe(gulp.dest('public/dist/js'))
  .pipe(rename('main.min.js'))
  // .pipe(uglify())
  .pipe(gulp.dest('public/dist/js'));
})

gulp.task('prod', function(){
  return (gulp.src('public/src/sass/main.scss'))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer())
    .pipe(gulp.dest('public/dist/css'));
});

gulp.task('watch',['browser-sync'], function(){
  gulp.watch('public/src/sass/**/*.scss', ['sass']);
  gulp.watch("public/src/js/**/*.js", ['js']);
});
