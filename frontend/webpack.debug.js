const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: "./assets/erlvulnscan.tsx",

  output: {
    filename: "erlvulnscan.js",
    path: __dirname + "/build",
  },
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
