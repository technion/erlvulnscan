module.exports = {
  context: __dirname,
  entry: "./assets/erlvulnscan.jsx",

  output: {
    filename: "erlvulnscan.js",
    path: __dirname + "/build",
  },
  module: {
    loaders: [
	  {
	    test: /\.jsx$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"],
      }
	],
  },
}
console.log("webpack rocks!");
