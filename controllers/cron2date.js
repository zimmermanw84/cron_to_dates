//
//  controllers/cron2date.js
//
//  Created by Walt Zimmerman on 8/24/16.
//

"use strict";

// Libs
const cronParser = require('cron-parser');

let options = {
  currentDate: new Date("2016-02-01T08:00:00.000Z"),
  endDate: new Date("2016-02-28T08:00:00.000Z"),
  iterator: true
};

// try {
//   let interval = cronParser.parseExpression("0 0 0 20 * *", options);
//   console.log(interval.next().toISOString());
//   console.log(interval.next().toISOString());
//   console.log(interval.next().toISOString());
// } catch(err) {
//   console.error(err.stack);
// }
let temp = [];

try {
  var interval = cronParser.parseExpression("0 0 0 25 3 *", options);

  do {
    let obj = interval.next();

  } while (!obj.done);
} catch (err) {
  console.log('Error: ' + err.message);
};

// module.exports = {

// };