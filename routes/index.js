//  index router
//  routes/index.js
//
//  Created by Walt Zimmerman on 10/21/16.
//

"use strict";

// Deeps
const express = require('express');
const router = express.Router();

// Controllers
const mainController = require("../controllers/main");

// Heartbeat test
router.get("/", (req, res, next) => {
  res.send("OK");
});

// Cron Parser
router.post("/calculate-crons", mainController.parserRequestHandler);

module.exports = router;
