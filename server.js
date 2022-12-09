const express = require('express');
const db = require('./config/connection');
const routes = require('./controllers');
const cors = require('cors')

const PORT = process.env.PORT || 3001;
const app = express();

// app.use(cors({
//   origin: /(https:\/\/shiny-hunter-server\.herokuapp\.com)\/(.*)$/
//   // origin: 'http://localhost:3000'
// }))
app.use(cors())
// app.options('*', cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
