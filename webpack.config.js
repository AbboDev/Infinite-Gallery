const path = require("path");
const webpack = require("webpack");
const es6_promise = require('es6-promise');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

/**
 * Plugins
 */
const plugins = [
  new VueLoaderPlugin()
];

es6_promise.polyfill();

if (process.env.NODE_ENV === "production") {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}

/**
 * Configuration
 */
const config = {
  entry: [
    "./src/js/app.js"
  ],

  output: {
    path: path.resolve(__dirname, "public/assets"),
    publicPath: "../",
    filename: "js/app.js"
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          hotReload: true
        }
      },
      {
        enforce: "pre",
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
              importLoaders: 1
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        exclude: /node_modules/,
        use:"url-loader?limit=1024&name=images/[name].[ext]"
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        use: "url-loader?limit=1024&name=fonts/[name].[ext]"
      },
    ]
  },

  plugins: plugins,

  devtool: "source-map",

  mode: "development",

  watch: ((process.env.NODE_ENV === "production") ? false : true)
}

/**
 * Exporting configuration
 */
module.exports = config;
