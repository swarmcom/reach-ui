var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    build: [
      'babel-polyfill',
      './src/main.js'
    ],
    vendor: [
      "vue",
      "jquery",
      "bootstrap",
      "bootstrap-vue",
      "vue-codemirror",
      "vue-awesome",
      "vue-notification",
      "vue-router",
      "vuejs-datepicker",
      "popper.js",
      "chart.js"
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  externals: {
    config: 'config'
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader', options: { loaders: {
        'scss': 'vue-style-loader!css-loader!sass-loader',
        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
      } } },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(png|jpg|gif|svg)$/, loader: 'file-loader', options: { name: '[name].[ext]?[hash]' } },
      { test: /\.css$/, use: [ { loader: "style-loader" }, { loader: "css-loader" } ] },
      { test: /\.scss$/, use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "postcss-loader", options: { plugins: function() { return [require('precss'), require('autoprefixer')] } } },
        { loader: "sass-loader" }
      ] }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': path.resolve(__dirname, 'src/')
      }
  },
  devServer: { historyApiFallback: true, noInfo: false },
  performance: { hints: false },
  cache: true,
  devtool: '#eval-source-map',
  plugins: [
    new CopyWebpackPlugin([{
      from: 'src/config.js', to: 'config.js'
    }]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.LoaderOptionsPlugin({ 
      minimize: true,
      optimization: {
        options: {
          minimize: true,
          splitChunks: {
            cacheGroups: {
              vendor: {
                name: "vendor",
                minChunks: Infinity
              }
            }
          }
        }
      }
    })
  ])
}
