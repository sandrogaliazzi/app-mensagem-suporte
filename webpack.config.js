const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  // The entry point file described above
  entry: "./src/index.js",
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: "eval-source-map",

  experiments: {
    topLevelAwait: true,
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // instead of style-loader
          "css-loader",
        ],
      },

      {
        test: /\.html$/,
        loader: "raw-loader",
      },
    ],
  },

  devServer: {
    allowedHosts: "all",
  },
};
