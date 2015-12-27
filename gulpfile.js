const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const webpack = require('webpack');

const config = {
  entry: './src/browser.js',
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src"),
        ],
        loader: 'babel',
        query: {
            presets: ['es2015', 'react']
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'browser.js'
  },
  target: 'atom'
}

function onBuild(done) {
  return function(err, stats) {
    if (!err) err = stats.compilation.errors;
    if(err) {
      console.log('Error', err);
    }
    else {
      console.log('Done!');
    }

    if(done) {
      done();
    }
  }
}

gulp.task('frontend', done => {
  webpack(config).run(onBuild(done));
});

gulp.task('backend', () => {
    return gulp.src('./app/main.js')
        .pipe(babel({
            presets: ['es2015'],
        }))
        .pipe(gulp.dest('app/dist'));
});

gulp.task('default', ['backend', 'frontend']);
