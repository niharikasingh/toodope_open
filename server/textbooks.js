const util = require('util');
const moment = require('moment');
const crypto = require('crypto');
const http = require('http');
const parseString = require('xml2js').parseString;

exports.setApp = function (app, pool) {

  // TODO this is breaking because I am not registered as an associate - fix somehow
  // Testbooks main page
  app.get('/awsTextbooks', function (req, res) {
    var origQuery = req.originalUrl.substring(14);
    origQuery = decodeURIComponent(origQuery);
    var currTime = moment().utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
    origQuery = "AWSAccessKeyId=" + process.env.AWSAPI_ACCESS_KEY_ID + "&" + origQuery;
    origQuery = origQuery + "&Timestamp=" + currTime;
    origQuery = encodeURIComponent(origQuery);
    origQuery = origQuery.replace(/%26/g, "&");
    origQuery = origQuery.replace(/%3D/g, "=");
    origQuery = "GET\nwebservices.amazon.com\n/onca/xml\n" + origQuery;
    const hmac = crypto.createHmac('sha256', process.env.AWSAPI_SECRET_ACCESS_KEY);
    hmac.update(origQuery);
    var signature = hmac.digest('base64');
    signature = encodeURIComponent(signature);
    origQuery = origQuery + "&Signature=" + signature;
    origQuery = origQuery.substring("GET\nwebservices.amazon.com\n/onca/xml\n".length);
    origQuery =  "/onca/xml?" + origQuery;
    var options = {
      host: "webservices.amazon.com",
      path: origQuery
    };
    http.get(options, function(res2) {
      var res2Str = '';
      res2.on('data', function (chunk) {
        res2Str += chunk;
      });
      res2.on('end', function () {
        parseString(res2Str, {explicitArray: true}, function(err, result) {
          if (err) {
            console.error("AWSTEXTBOOK error: " + err);
          }
          else {
            var awsInfo = {};
            var i = 0;
            if ((result['ItemLookupResponse'] != null) && (result['ItemLookupResponse']['Items'] != null) && (result['ItemLookupResponse']['Items'][0]['Item'] != null)) {
              for (j = 0; j < result['ItemLookupResponse']['Items'][0]['Item'].length; j++) {
                var item = result['ItemLookupResponse']['Items'][0]['Item'][j];
                var tempDetailPageURL = item['DetailPageURL'] ? item['DetailPageURL'][0] : null;
                var tempLowUsedPrice = null;
                var tempLowNewPrice = null
                if (item['OfferSummary'] != null) {
                  tempLowNewPrice =  item['OfferSummary'][0]['LowestNewPrice'] ? item['OfferSummary'][0]['LowestNewPrice'][0]['FormattedPrice'][0] : null;
                  tempLowUsedPrice =  item['OfferSummary'][0]['LowestUsedPrice'] ? item['OfferSummary'][0]['LowestUsedPrice'][0]['FormattedPrice'][0] : null;
                }
                var tempTitle = null;
                var tempAuthor = null;
                var tempType = null;
                var tempListPrice = null;
                var tempTradeInValue = null;
                if (item['ItemAttributes'] != null) {
                  tempTitle = item['ItemAttributes'][0]['Title'] ? item['ItemAttributes'][0]['Title'][0] : null;
                  tempAuthor = item['ItemAttributes'][0]['Author'] ? item['ItemAttributes'][0]['Author'] : null;
                  tempType = item['ItemAttributes'][0]['Format'] ? item['ItemAttributes'][0]['Format'][0] : (item['ItemAttributes'][0]['ProductGroup'] ? item['ItemAttributes'][0]['ProductGroup'][0] : null);
                  tempListPrice = item['ItemAttributes'][0]['ListPrice'] ? item['ItemAttributes'][0]['ListPrice'][0]['FormattedPrice'][0] : null;
                  tempTradeInValue = item['ItemAttributes'][0]['TradeInValue'] ? item['ItemAttributes'][0]['TradeInValue'][0]['FormattedPrice'][0] : null;
                }
                var tempAwsInfo = {
                  'DetailPageURL': tempDetailPageURL,
                  'ImageURL': item['MediumImage'] ? item['MediumImage'][0]['URL'][0] : null,
                  'ImageHeight': item['MediumImage'] ? item['MediumImage'][0]['Height'][0]["_"] : null,
                  'ImageWidth': item['MediumImage'] ? item['MediumImage'][0]['Width'][0]["_"] : null,
                  'Title': tempTitle,
                  'Author': tempAuthor,
                  'Type': tempType,
                  'ListPrice': tempListPrice,
                  'TradeInValue': tempTradeInValue,
                  'LowUsedPrice': tempLowUsedPrice,
                  'LowNewPrice': tempLowNewPrice
                };
                awsInfo[i] = tempAwsInfo;
                i += 1;
              }
            }
            res.send(JSON.stringify(awsInfo));
          }
        });
      });
    }).on('error', function (e) {
      console.error("AWSTEXTBOOK ERROR: " + e);
    });
  });

  app.get('/stuTextbooks', function (req, res) {
    var searchParams = req.query;
    var isbn = searchParams["isbn"];
    isbn = isbn.replace(/[^0-9]/g, "");
    var condition = searchParams["condition"];
    condition = condition.replace(/[^A-Za-z]/g, "");
    var queryString = "SELECT users, price, condition FROM textbooks WHERE";
    queryString += util.format(" isbn=$1");
    const queryValues = [isbn];
    if (condition.length != 0) {
      queryString += util.format(" AND condition=$2");
      queryValues.push(condition);
    }
    queryString += " AND sold=false ORDER BY price ASC;";
    pool.query(queryString, queryValues)
      .then((result) => res.send(result.rows))
      .catch((err) => console.error('error running query', err, queryString));
  });

  app.get('/getUserTextbooks', function (req, res) {
    var searchParams = req.query;
    var user = searchParams["user"];
    if ( (user.match(/^[^;\s@]+@[^;\s@]+\.[^;\s@]+$/) == null) ) {
      res.status(400).send();
      return;
    }
    const queryString = "SELECT isbn, price, adddate, id FROM textbooks WHERE users=$1 AND sold=false ORDER BY adddate DESC;";
    const queryValues = [user];
    pool.query(queryString, queryValues)
      .then((result) => res.send(result.rows))
      .catch((err) => console.error('error running query', err, queryString));
  });

  app.get('/removeTextbook', function (req, res) {
    var searchParams = req.query;
    var id = parseInt(searchParams["id"]);
    var sold = searchParams["sold"];
    if ((sold != "true") && (sold != "false")) {
      console.error('received non-boolean sold ', err);
      res.status(400).send();
      return;
    }
    const queryString = util.format("UPDATE textbooks SET sold=$1 WHERE id=$2;", );
    const queryValues = [sold, id];
    pool.query(queryString, queryValues)
      .then((result) => res.send(result.rows))
      .catch((err) => console.error('error running query', err, queryString));
  });

  app.get('/postTextbooks', function (req, res) {
    var searchParams = req.query;
    var isbn = searchParams["isbn"];
    var condition = searchParams["condition"];
    condition = condition.replace(/[^A-Za-z]/g, "");
    var price = searchParams["price"];
    var users = searchParams["users"];
    if ( (users.match(/^[^;\s@]+@[^;\s@]+\.[^;\s@]+$/) == null) || isNaN(parseInt(isbn)) || isNaN(parseFloat(price)) ) {
      res.status(400).send();
      return;
    }
    const queryString = "INSERT INTO textbooks VALUES (DEFAULT, $1, $2, $3, $4, false, DEFAULT);";
    const queryValues = [parseInt(isbn), users, parseFloat(price), condition];
    pool.query(queryString, queryValues)
      .then(() => res.send(true))
      .catch((err) => console.error('error running query', err, queryString));
  });

}
