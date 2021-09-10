const aws = require('aws-sdk');
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
const pythonShell = require('python-shell');
const util = require('util');

exports.setApp = function (app, pool, urlencodedParser) {

  // initialize jobs queue used to anonymize uploads
  const connection = new IORedis(process.env.REDIS_URL);
  const queue = new Queue('pyclean', { connection });

  app.get('/searchOutlines', function (req, res) {
    var searchParams = req.query;
    // clean query variables
    var courseName = searchParams["courseName"];
    courseName = courseName.replace(/[^-a-z0-9 ]/g , "");
    var professorLastName = searchParams["professorLastName"];
    professorLastName = professorLastName.replace(/[^-a-z ]/g , "");
    var userName = searchParams["userName"];
    userName = userName.replace(/[^-_a-z0-9]/g , "");
    var content = searchParams["content"];
    content = content.replace(/[^-a-z0-9 ]/g , "");
    var grade = searchParams["grade"];
    if (grade != 0) grade = grade.replace(/[^A-Za-z]/g, "");
    var doctype = searchParams["doctype"];
    if (doctype != 0) doctype = doctype.replace(/[^A-Za-z]/g, "");
    var semester = searchParams["semester"];
    if (semester != 0) semester = semester.replace(/[^A-Za-z]/g, "");
    var year = searchParams["year"];
    if (year != 0) year = year.replace(/[^0-9]/g, "");
    // construct query
    var queryString = "SELECT doctype, hearts, docname, semester, year, grade, professorlast, random, $1=ANY(userhearts) AS thisuserheart";
    var queryValues = [userName]
    var i = 2;
    if (content.length > 0) {
      queryString += ", ts_headline('english', content, plainto_tsquery('english', $" + i + "), 'MaxFragments=1, MinWords=25, MaxWords=45') AS preview";
      queryValues.push(content);
      i += 1;
    }
    queryString += " FROM outlinestable WHERE";
    // include at least one of course name and professor name in query
    if (courseName.length > 0) {
      queryString += " course LIKE $" + i;
      queryValues.push("%" + courseName + "%");
      i += 1;
    }
    if (professorLastName.length > 0) {
      if (courseName.length > 0) {
        queryString += " AND"
      }
      queryString += " professorlast=$" + i;
      queryValues.push(professorLastName);
      i += 1;
    }
    // include optional filters in query
    if (content.length > 0) {
      queryString += " AND content_vec @@ plainto_tsquery('english', $" + i + ")";
      queryValues.push(content);
      i += 1;
    }
    if (grade != 0) {
      queryString += " AND grade=$" + i;
      queryValues.push(grade);
      i += 1;
    }
    if (doctype != 0) {
      queryString += " AND doctype=$" + i;
      queryValues.push(doctype);
      i += 1;
    }
    if (semester != 0) {
      queryString += " AND semester=$" + i;
      queryValues.push(semester);
      i += 1;
    }
    if (year != 0) {
      queryString += " AND year=$" + i;
      queryValues.push(year);
      i += 1
    }
    queryString += " ORDER BY hearts DESC, id DESC;";
    // execute query
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(queryString, queryValues, function(err, result) {
        done();  //release the client back to the pool
        if(err) {
          return console.error('error running query', err, queryString);
        }
        res.send(result.rows);
      });
    });
  });

  // user favorited or unfavorited an outline
  app.post('/incOutlineHeart', urlencodedParser, function(req, res) {
    var outlineID = parseInt(req.body.outlineID);
    var incAmount = parseInt(req.body.incAmount);
    var userName = req.body.userName;
    userName = userName.replace(/[^-_a-z0-9]/g , "");
    res.status(204).send();
    var queryString = "";
    if (incAmount == 1) {
      queryString = util.format("UPDATE outlinestable SET hearts=hearts+1 WHERE id=%d;", outlineID);
      queryString += util.format("UPDATE outlinestable SET userhearts=array_append(userhearts, '%s') WHERE id=%d", userName, outlineID);
    }
    else if (incAmount == -1) {
      queryString = util.format("UPDATE outlinestable SET hearts=hearts-1 WHERE id=%d;", outlineID);
      queryString += util.format("UPDATE outlinestable SET userhearts=array_remove(userhearts, '%s') WHERE id=%d", userName, outlineID);
    }
    pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(queryString, function(err, result) {
        done();  //release the client back to the pool
        if(err) {
          return console.error('error running query', err);
        }
      });
    });
  });

  // anonymize and upload outlines
  app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3({
      signatureVersion: 'v4',
      region: 'us-east-2'
    });
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    if ((fileName.substr(-4,4) != ".pdf") && (fileName.substr(-5,5) != ".docx")) res.status(400).send("Incorrect file type.");

    const s3Params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.error(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${s3Params.Bucket}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
    queue.add('file', { filename: fileName });
  });

  // Send anonymization to python
  const worker = new Worker('pyclean', async job => {
    if (job.name === 'file') {
      var pythonOptions = {
        mode: 'text',
        args: [job.data.filename]
      };
      setTimeout(function() {
        var pyclean = new pythonShell.run('outlines/amazonbot.py', pythonOptions);
        pyclean.on('message', function (message) {
          console.error(message);
        });
        pyclean.end(function (err) {
          if (err) {
            console.error('PYCLEAN error: ' + err);
          }
        });
      }, 10000);
    }
  }, { connection });

};
