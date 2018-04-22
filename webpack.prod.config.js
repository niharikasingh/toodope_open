var webpack = require('webpack')

module.exports = {
  entry: {
    registration: './public/js/registration.js',

  },
  output: {
    filename: './public/js/[name]bundle.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ]
};
