var path = require('path');

module.exports = {
  output: {
    path: path.join(process.cwd(), './.burnside/'),
    filename: 'app.bundle.js'
  },
  context: __dirname,
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
