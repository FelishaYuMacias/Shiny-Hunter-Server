const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shiny-hunter-server', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

import Pokedex from 'pokedex-promise-v2';
const options = {
  protocol: 'https',
  hostName: 'localhost:443',
  versionPath: '/api/v2/',
  cacheLimit: 100 * 1000, // 100s
  timeout: 5 * 1000 // 5s
}
const P = new Pokedex(options);

module.exports = mongoose.connection;
