//  Main Server
//  /app.js
//
//  Created by Walt Zimmerman on 10/21/16.
//

// Node.js Version v4.2.3
"use strict";

// Deeps
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

// PORT
const PORT = (process.env.PORT || 3000);
// ENVIRONMENT
const ENV = process.env.NODE_ENV || "development";

// Timestamp logger
require('console-stamp')(console, { pattern : "dd/mm/yyyy HH:MM:ss.l" });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log(ENV);

// // Auth (Naive)
if(process.env.NODE_ENV == "production") {
  app.use((req, res, next) => {
    if(process.env.APP_SECRET === req.query.app_secret &&
        process.env.APP_ID === req.query.app_id) {
      return next();
    } else {
      return req.status(401).send();
    }
  });
};

// Router
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(PORT, (req, res, next) => {
  console.log(`Running on port ${PORT}`);
  console.log(`ENVIRONMENT: ${ENV}`);
});

module.exports = app;
