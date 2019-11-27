const isDev = process.env.NODE_ENV === 'development';
const webpack = require('webpack');

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: [
    '@babel/polyfill', // enables async-await
    './client/index.js'
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      videojs: 'video.js'
    }
  },
  devtool: 'source-map',
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new webpack.ProvidePlugin({
      videojs: 'video.js/dist/video.cjs.js',
      RecordRTC: 'recordrtc'
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {inline: true, name: 'public/worker.js'}
        }
      }
    ]
  }
};
