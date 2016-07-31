//https://github.com/babel/babel-loader
//http://webpack.github.io/docs/


var path = require('path');
var webpack = require('webpack');



var TARGET = process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);
var SRC_DIR = 'src';

var config = {
  paths: {
    src: path.join(ROOT_PATH, SRC_DIR),
    out:path.join(ROOT_PATH,"build"),
    sophie: path.join(ROOT_PATH, SRC_DIR, 'sophie.js'),
    test:path.join(ROOT_PATH, SRC_DIR, "test.js"),

  },
}


module.exports = {
    entry: {
      sophie:config.paths.sophie,
      test:config.paths.test
    },
    output: {
        path: config.paths.out,
        filename: '[name].js',
        sourceMapFilename:"[file].map"
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
        
          loader: ["babel-loader"],
          query: {}
        }
       ]
    },
    plugins:[

    ]
}
