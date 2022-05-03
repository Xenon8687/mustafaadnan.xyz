const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'src', 'public'),
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
  })]
};