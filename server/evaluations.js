const util = require('util');

exports.setApp = function (app, pool) {

  app.get('/searchHlsEvals', function (req, res) {
    var searchParams = req.query;
    var course = searchParams["course"];
    course = course.replace(/[^-a-z0-9 \/]/g , "");
    var professor = searchParams["professor"]
    professor = professor.replace(/[^-a-z0-9 \/]/g , "");
    var queryString = "SELECT * FROM hlsevals WHERE";
    if (course.length == 0) queryString += util.format(" professor LIKE '%%%s%%'", professor);
    else if (professor.length == 0) queryString += util.format(" course LIKE '%%%s%%'", course);
    else queryString += util.format(" professor LIKE '%%%s%%' AND course LIKE '%%%s%%'", professor, course);
    queryString += " ORDER BY year DESC, semester DESC;";
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(queryString, function(err, result) {
        done();  //release the client back to the pool
        if(err) {
          return console.error('error running query', err);
        }
        res.send(result.rows);
      });
    });
  });

  app.get('/searchDopeComments', function (req, res) {
    var searchParams = req.query;
    var course = searchParams["course"];
    course = course.replace(/[^-a-z0-9 \/]/g , "");
    var professor = searchParams["professor"]
    professor = professor.replace(/[^-a-z0-9 \/]/g , "");
    var queryString = "SELECT comments FROM dopeevals WHERE";
    if (course.length == 0) queryString += util.format(" professor LIKE '%%%s'", professor);
    else if (professor.length == 0) queryString += util.format(" course LIKE '%%%s%%'", course);
    else queryString += util.format(" professor LIKE '%%%s' AND course LIKE '%%%s%%'", professor, course);
    queryString += " AND comments IS NOT NULL ORDER BY adddate DESC;";
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(queryString, function(err, result) {
        done();  //release the client back to the pool
        if(err) {
          return console.error('error running query', err);
        }
        res.send(result.rows);
      });
    });
  });

  app.get('/searchDopeEvals', function (req, res) {
    var searchParams = req.query;
    var course = searchParams["course"];
    course = course.replace(/[^-a-z0-9 \/]/g , "");
    var professor = searchParams["professor"]
    professor = professor.replace(/[^-a-z0-9 \/]/g , "");
    var queryString = "SELECT mode() WITHIN GROUP (ORDER BY interaction) FILTER (WHERE interaction != 0) AS interaction,";
    queryString += " mode() WITHIN GROUP (ORDER BY feelings) FILTER (WHERE feelings != 0) AS feelings,";
    queryString += " mode() WITHIN GROUP (ORDER BY laptops) FILTER (WHERE laptops != 0) AS laptops,";
    queryString += " mode() WITHIN GROUP (ORDER BY reading) FILTER (WHERE reading != 0) AS reading,";
    queryString += " mode() WITHIN GROUP (ORDER BY exam) FILTER (WHERE exam != 0) AS exam,";
    queryString += " mode() WITHIN GROUP (ORDER BY attendance) FILTER (WHERE attendance != 0) AS attendance,";
    queryString += " mode() WITHIN GROUP (ORDER BY success) FILTER (WHERE success != 0) AS success,";
    queryString += " mode() WITHIN GROUP (ORDER BY difficulty) FILTER (WHERE difficulty != 0) AS difficulty,";
    queryString += " mode() WITHIN GROUP (ORDER BY grades) FILTER (WHERE grades != 0) AS grades,";
    queryString += " mode() WITHIN GROUP (ORDER BY preferencing) FILTER (WHERE preferencing != 0) AS preferencing,";
    queryString += " mode() WITHIN GROUP (ORDER BY inclusive) FILTER (WHERE inclusive != 0) AS inclusive";
    queryString += " FROM dopeevals WHERE";
    if (course.length == 0) queryString += util.format(" professor LIKE '%%%s';", professor);
    else if (professor.length == 0) queryString += util.format(" course LIKE '%%%s%%';", course);
    else queryString += util.format(" professor LIKE '%%%s' AND course LIKE '%%%s%%';", professor, course);
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(queryString, function(err, result) {
        done();  //release the client back to the pool
        if(err) {
          return console.error('error running query', err);
        }
        res.send(result.rows);
      });
    });
  });

  app.get('/uploadEval', function (req, res) {
    var searchParams = req.query;
    var course = searchParams["course"];
    course = course.replace(/[^-a-z0-9 \/]/g , "");
    var professor = searchParams["professor"],
    professor = professor.replace(/[^-a-z0-9 \/]/g , "");
    var userName = searchParams["userName"];
    var interaction = searchParams["interaction"];
    var feelings = searchParams["feelings"];
    var laptops = searchParams["laptops"];
    var reading = searchParams["reading"];
    var exam = searchParams["exam"];
    var attendance = searchParams["attendance"];
    var success = searchParams["success"];
    var difficulty = searchParams["difficulty"];
    var grades = searchParams["grades"];
    var preferencing = searchParams["preferencing"];
    var inclusive = searchParams["inclusive"];
    var comments = searchParams["comments"];
    comments = comments.replace(/[<>]/g , "");
    var queryString = util.format("INSERT INTO dopeevals VALUES (DEFAULT, 0, '%s', '%s', %d, %d, %d, %d, %d, %d, %d, %d, %d, %d, %d, DEFAULT, '%s');", course, professor, interaction, feelings, laptops, reading, exam, attendance, success, difficulty, grades, preferencing, inclusive, comments);
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
        res.status(400).send();
      }
      client.query("INSERT INTO dopeevals VALUES (DEFAULT, 0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, DEFAULT, $14)", [course, professor, interaction, feelings, laptops, reading, exam, attendance, success, difficulty, grades, preferencing, inclusive, comments], function(err, result) {
        done();  //release the client back to the pool
        res.send(true);
        if(err) {
          return console.error('error running query', err);
          res.status(400).send();
        }
      });
    });
  });

}
