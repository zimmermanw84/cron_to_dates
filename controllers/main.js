//
//  controllers/main.js
//
//  Created by Walt Zimmerman on 8/24/16.
//

"use strict";

// Model
const FrequencyRequest = require("../models/frequency_request");

/*
  =====================================================================================
  Main - parserRequestHandler

  Handler for frequency cron parser
  =====================================================================================
*/

const parserRequestHandler = function parserRequestHandler(req, res, next) {
  // Generally I would have a data store or I would be doing some aync actions
  // so I could use a promise chain and the catch block to handle the error
  try {
    let CronParser = new FrequencyRequest(req.body);

    res.json(CronParser.buildReponse());
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { parserRequestHandler };