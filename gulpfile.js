const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');


const config = {
  entry: './src/js/main.js',
  input: {
    html: './src/**/*.html',
    css: './src/css/*.css',
    assets: './src/assets/*.png',
  },
  output: {
    js: './build/js',
    html: './build',
    css: './build/css',
    assets: './build/assets',
  },
};

gulp.task('js', () => {
  return browserify(config.entry)
      .bundle()
      .pipe(source(config.entry))
      .pipe(rename('main.js'))
      .pipe(gulp.dest(config.output.js));
});

gulp.task('assets', () => {
  return gulp.src(config.input.assets)
      .pipe(gulp.dest(config.output.assets));
});

gulp.task('html', () => {
  return gulp.src(config.input.html)
      .pipe(gulp.dest(config.output.html));
});

gulp.task('reload', (cb) => {
  browserSync.reload();
  cb();
});

gulp.task('build', gulp.series(['js', 'html', 'reload', 'assets']));

gulp.task('watch', () => {
  browserSync.init({
    server: {
      baseDir: './build',
    },
  });

  gulp.watch('./src/**/*.*', gulp.series('build'));
});
