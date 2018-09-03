const express = require('express');
const {OAuth2Client} = require('google-auth-library');
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require('pg');
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
var pgconfig = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  host: process.env.PGHOST,
  max: 3, // max number of clients in the pool
  idleTimeoutMillis: 30000 // client will remain idle before being closed
};
var pool = new pg.Pool(pgconfig);
pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
})

require('./server/search.js').setApp(app, pool, urlencodedParser);
require('./server/textbooks.js').setApp(app, pool);
require('./server/evaluations.js').setApp(app, pool);
require('./server/encourage.js').setApp(app, pool, urlencodedParser);

// Sign in through Google
app.post('/verifyToken', urlencodedParser, function (req, res) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.idtoken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    const domain = payload['hd'];
    if (domain && domain.endsWith("harvard.edu")) {
      res.send("Success.");
    }
    else {
      res.send("Not Harvard login.");
    }
  }
  verify().catch(console.error);
});

// global error handler
app.get('/globalError', function (req, res) {
  console.error("GLOBAL ERROR: " + JSON.stringify(req.query));
  res.send(true);
});
