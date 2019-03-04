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

const QUERIES = {
  createTables: (
    "CREATE TABLE IF NOT EXISTS purchase_history (" +
    "   date text," +
    "   name text," +
    "   amount real" +
    ")"
  ),
  getPurchases: "SELECT date, name as purchaseName, amount as purchaseAmount FROM purchase_history",
  insertPurchase: "INSERT INTO purchase_history ($1, $2, $3)",
}

const DATABASE_URL = process.env.DATABASE_URL;

if (DATABASE_URL) {
  console.log("Setting up the database: DATABASE_URL = ", DATABASE_URL);
  var client = new pg.Client(DATABASE_URL);
  client.connect();
  console.log("Connected to the database, ensuring the tables are created.");
  client.query(QUERIES.createTables).then(function () {
    console.log("Database is set up");
  }).catch(function (reason) {
    console.error("Failed to set up database: ", reason);
  });
}

function withDatabase(action, onError) {
  if (DATABASE_URL) {
    var client = new pg.Client(DATABASE_URL);
    client.connect();
    action(client);
  } else {
    onError();
  }
}

// Routes
app.route("/api/history")
  .get(function (req, res) {
    withDatabase(function (client) {
      client.query(QUERIES.getPurchases).then(function (queryResult) {
        res.json(queryResult.rows);
      });
    }, function () {
      res.json([{
        date: new Date().toISOString(),
        purchaseName: "A Book",
        purchaseAmount: 20.00
      }, {
        date: new Date().toISOString(),
        purchaseName: "A game",
        purchaseAmount: 60.00
      }]);
    });
  })
  .post(function (req, res) {
    withDatabase(function (client) {
      client.query(QUERIES.insertPurchase, [req.body.date, req.body.purchaseName, req.body.purchaseAmount]).then(function () {
        res.json({
          status: 'ok'
        })
      }).catch(function () {
        res.json({
          status: 'failed'
        })
      });
    }, function () {
      res.json({
        status: 'ok'
      })
    })
  });

module.exports = app;