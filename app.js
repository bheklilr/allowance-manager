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
  createTables: "CREATE TABLE IF NOT EXISTS purchase_history (date text, name text, amount real);",
  getPurchases: "SELECT date, name, amount FROM purchase_history;",
  insertPurchase: "INSERT INTO purchase_history(date, name, amount) VALUES($1, $2, $3);",
  clear: "TRUNCATE purchase_history;"
}

const DATABASE_URL = process.env.DATABASE_URL;

if (DATABASE_URL) {
  console.log("Setting up the database: DATABASE_URL = ", DATABASE_URL);
  var client = new pg.Client(DATABASE_URL);
  client.connect().then(function () {
    console.log("Connected to the database, ensuring the tables are created.");
    client.query(QUERIES.createTables).then(function () {
      console.log("Database is set up");
    }).catch(function (reason) {
      console.error("Failed to set up database: ", reason);
      process.exit(-2);
    });
  }).catch(function (reason) {
    console.log("Failed to connect to database: ", reason);
    process.exit(-1);
  });
}

function withDatabase(action, onError) {
  if (DATABASE_URL) {
    var client = new pg.Client(DATABASE_URL);
    client.connect().then(function () {
      action(client)
    }).catch(onError);
  } else {
    onError();
  }
}

// Routes
app.route("/api/history")
  .get(function (req, res) {
    withDatabase(function (client) {
      client.query(QUERIES.getPurchases).then(function (queryResult) {
        console.log("Found ", queryResult.rows.length, " purchases");
        res.json(queryResult.rows.map(function (row) {
          return {
            date: row.date,
            purchaseName: row.name,
            purchaseAmount: row.amount
          };
        }));
      });
    }, function () {
      res.json([]);
    });
  })
  .post(function (req, res) {
    withDatabase(function (client) {
      let values = [req.body.date.toISOString(), req.body.purchaseName, req.body.purchaseAmount];
      console.log("Inserting purchase for ", req.body);
      client.query(QUERIES.insertPurchase, values).then(function () {
        console.log("Inserted successfully");
        res.json({
          status: 'ok'
        })
      }).catch(function (reason) {
        console.log("Failed to insert:", reason);
        res.json({
          status: 'failed',
          reason: reason ? reason.code : "",
        })
      });
    }, function () {
      res.json({
        status: 'ok'
      })
    })
  });

api.route("/api/history/clear").get(function (req, res) {
  console.log("Clearing the database");
  withDatabase(function (client) {
    client.query(QUERIES.clear).then(function (queryResult) {
      res.json({});
    }).catch(function (reason) {
      res.json({});
    })
  })
})

module.exports = app;