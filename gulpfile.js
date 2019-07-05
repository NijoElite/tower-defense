const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const tsify = require('tsify');


const config = {
  entry: './src/js/main.ts',
  input: {
    html: './src/**/*.html',
    css: './src/css/*.css',
    assets: './src/assets/**/*.*',
  },
  output: {
    js: './build/js',
    html: './build',
    css: './build/css',
    assets: './build/assets',
  },
};

gulp.task('js', () => {
  return browserify(config.entry, {debug: true})
      .plugin(tsify, {target: 'es6'})
      .bundle()
      .pipe(source('main.js'))
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
