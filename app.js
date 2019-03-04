var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var pg = require("pg");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

const HISTORY_QUERY = "SELECT date, name as purchaseName, amount as purchaseAmount FROM purchase_history";

// Routes
app.route("/api/history")
  .get(function (req, res) {
    if (!process.env.DATABASE_URL) {
      res.json([{
        date: new Date().toISOString(),
        purchaseName: "A Book",
        purchaseAmount: 20.00
      }]);
      return;
    }
    var client = new pg.Client();
    client.connect(process.env.DATABASE_URL)
      .then(function () {
        client.query(HISTORY_QUERY).then(function (queryResult) {
          res.json(queryResult.rows);
        }).then(function () {
          client.end();
        })
      });
  });

module.exports = app;