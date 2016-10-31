var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'textapp'
    },
    port: process.env.PORT || 3000,
  },

  test: {
    root: rootPath,
    app: {
      name: 'textapp'
    },
    port: process.env.PORT || 3000,
  },

  production: {
    root: rootPath,
    app: {
      name: '3aauctionsapi'
    },
    port: process.env.port,
  }
};

module.exports = config[env];
