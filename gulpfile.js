const gulp = require('gulp');
const webpack = require('webpack-stream');
const webpackPopupConfig = require('./webpack.popup.config');
const webpackExtensionConfig = require('./webpack.entension.config');

gulp.task('clean', clean);
gulp.task('compile', gulp.series('clean', compile));
gulp.task('watch', gulp.series('compile', () => {
  gulp.watch('src/**/*', gulp.series('compile'));
}));

function clean() {
  return gulp.src('./dist', {read: false, allowEmpty: true})/* .pipe(gulpclean({force: true})) .pipe(gulp.dest('./dist'))*/;
}

function compile() {
  const webpackPopup = gulp.src('./src/app/**/*.ts', './src/common/**/*.ts').pipe(webpack(webpackPopupConfig)).pipe(gulp.dest('./dist/app'));
  const webpackExtension = gulp.src('./src/extension/**/*.ts', './src/common/**/*.ts').pipe(webpack(webpackExtensionConfig)).pipe(gulp.dest('./dist/extension'));
  const manifestResult = gulp.src(['./src/app/manifest.json']).pipe(gulp.dest('./dist/'));
  const indexResult = gulp.src(['./src/app/index.html']).pipe(gulp.dest('./dist/app/'));
  const assetsResult = gulp.src(['./src/app/assets/**/*']).pipe(gulp.dest('./dist/app/assets/'));
  const merged = [
    webpackPopup,
    webpackExtension,
    manifestResult,
    indexResult,
    assetsResult
  ];
  
  return new Promise((resolve, reject) => {
    if(merged.every(v => v)) {
      resolve();
    }
    else {
      reject();
    }
  });
}