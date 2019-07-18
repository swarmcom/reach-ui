var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  entry: {
    build: [
      'babel-polyfill',
      './src/main.js'
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
      { test: /\.css$/, use: [ 
        { loader: "style-loader" }, 
        { 
          loader: "css-loader",
        }
      ] },
      { test: /\.scss$/, use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "postcss-loader", options: { plugins: function() { return [require('precss'), require('autoprefixer')] } } },
        { loader: "sass-loader" }
      ] },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ]
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
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
    }),
    new VueLoaderPlugin()
  ]
}
