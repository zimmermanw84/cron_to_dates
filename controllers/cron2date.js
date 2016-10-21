//
//  controllers/cron2date.js
//
//  Created by Walt Zimmerman on 8/24/16.
//

"use strict";

// Libs
const cronParser = require('cron-parser');

try {
  let interval = cronParser.parseExpression("0 0 0 20 * *");
  console.log(interval.next().toISOString());
  console.log(interval.next().toISOString());
  console.log(interval.next().toISOString());
} catch(err) {
  console.error(err.stack);
}

// module.exports = {

// };