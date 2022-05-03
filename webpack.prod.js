const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  mode: 'production',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'production', 'public'),
    publicPath : '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-react'],
            plugins: ["react-hot-loader/babel"]
          }
        }
      },
      {
        test: /\.(scss|css|sass)$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            url: false
          }
        }, 'postcss-loader', 'sass-loader',]
     }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    template: './src/public/index_template.html',
    fileName: 'index.html',
    scriptLoading: "blocking",
  })],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          output: {
            ecma: 5,
            comments: false
          }
        }
      })
    ],
  }
};