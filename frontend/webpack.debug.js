const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: "./assets/erlvulnscan-entry.tsx",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".js", ".d.ts"]
  },
  output: {
    filename: "erlvulnscan.js",
    path: __dirname + "/build",
  },
  module: {
    rules: [
	  {
        test: /\.tsx$/,
        exclude: /node_modules/,
        loaders: ["ts-loader"],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
	],
  },
}
console.log("webpack running:");
