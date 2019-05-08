const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './example/index.tsx',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.min.js',
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true,
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      'react-kentico-blog': path.resolve(__dirname, 'src'),
      '@example': path.resolve(__dirname, 'example'),
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          compiler: 'ttypescript',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html',
    }),
  ],
};
