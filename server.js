const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// TODO get sean to test CORS
// disable CORS
var corsOptions = {
  origin: [/\.toodope\.org$/, 'http://localhost:'+process.env.HOST, 'https://secure-refuge-35396.herokuapp.com'],
}

// set up server
var app = express();
app.use(express.static("public"));
app.use(cors(corsOptions))
app.listen(parseInt(process.env.PORT));

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// set up postgresql database
const pgconfig = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  host: process.env.PGHOST,
  max: 3, // max number of clients in the pool
  idleTimeoutMillis: 30000 // client will remain idle before being closed
};
const pool = new Pool(pgconfig);
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
})

require('./server/search.js').setApp(app, pool, urlencodedParser);
require('./server/textbooks.js').setApp(app, pool);
require('./server/evaluations.js').setApp(app, pool);
require('./server/encourage.js').setApp(app, pool, urlencodedParser);

// global error handler
app.get('/globalError', function (req, res) {
  console.error("GLOBAL ERROR: " + JSON.stringify(req.query));
  res.send(true);
});
