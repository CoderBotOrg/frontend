'use strict'

const webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  publicPath: (process.env.NODE_ENV === 'development' ? '': '/vue/'),
  assetsDir: '',
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.xml$/,
          loader: 'url-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      ]
    },   
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"development"',
          // Backend location. Must point to the exposed Flask instance
          //  By default, if you run the backend locally, it's available at localhost:5000
          CB_ENDPOINT: (process.env.NODE_ENV === 'development' ? '"http://coderbot.local"': '""'),
          // Legacy APIs
          APIv1: '""',
          // New API, exposed by Connexion
          APIv2: '"/v2"'
        }
      }),
      //new webpack.HotModuleReplacementPlugin(),
      //new webpack.NoEmitOnErrorsPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
      }),
      // Copy over media resources from the Blockly package
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, './node_modules/blockly/media'),
          to: path.resolve(__dirname, 'dist/media')
        }
      ]),
      // copy custom static assets
      /*new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'static'),
          to: config.dev.assetsSubDirectory,
          ignore: ['.*']
        }
      ])*/
    ]
  },
}
