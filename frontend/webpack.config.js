const webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: "source-map",
  entry: "./assets/erlvulnscan.tsx",

  output: {
    filename: "erlvulnscan.js",
    path: __dirname + "/build",
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
	  {
	    test: /\.tsx$/,
        exclude: /node_modules/,
        loaders: ["ts-loader"],
      }
	],
  },
}
console.log("webpack running:");
