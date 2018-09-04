const util = require('util');

exports.setApp = function (app, pool, urlencodedParser) {

  app.get('/encourage', function (req, res) {
    var searchParams = req.query;
    var userName = searchParams["userName"];
    userName = userName.replace(/[^-_a-z0-9]/g , "");
    var page = searchParams["page"];
    page = page.replace(/[^a-z]/g , "");

    if ((userName.slice(-9,-5) != 'lm19') && (userName.slice(-9,-5) != 'jd19') && (userName.slice(-9,-5) != 'jd20')) {
      res.send(true);
      return;
    }

    var queryString = "SELECT * FROM encourage WHERE username=$1;";
    var queryValues = [userName];

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(queryString, queryValues, function(err, result) {
        done();  //release the client back to the pool
        if(err) {
          return console.error('error running query', err, queryString);
        }
        if (result.rows.length == 0) {
          res.send(false);
        }
        else {
          res.send(result.rows[0][page]);
        }
      });
    });
  });

  app.post('/encourage', urlencodedParser, function (req, res) {
    var userName = req.body.userName;
    userName = userName.replace(/[^-_a-z0-9]/g , "");
    var page = req.body.page;
    if ((page != "outlines") && (page != "evaluations")) {
      res.send(false); // error because page has only two possible values
    }

    var queryString = util.format("INSERT INTO encourage (username, %s) VALUES ($1, true) ON CONFLICT (username) DO UPDATE SET %s=EXCLUDED.%s;", page, page, page);
    var queryValues = [userName];

    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(queryString, queryValues, function(err, result) {
        done();  //release the client back to the pool
        if(err) {
          return console.error('error running query', err, queryString);
        }
      });
    });
  });

};
