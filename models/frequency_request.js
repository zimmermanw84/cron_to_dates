//
//  controllers/frequency_request.js
//
//  Created by Walt Zimmerman on 8/24/16.
//

"use strict";

// Libs
const cronParser = require('cron-parser');

/**
 * @class FrequencyRequest
 * @param requestData {Object}
 */
module.exports = class FrequencyRequest {
  constructor(requestData) {
    requestData = requestData || {};
    this.startDate = new Date(requestData.start_date);
    this.endDate = new Date(requestData.end_date);
    this.frequencies = requestData.frequencies || [];

    // Naive validation
    if(!this._isValid()) {
      throw new TypeError("Invalid Request Data");
    }
  };

  /**
   * @function _buildReponse
   * @public
   * @return {Object}
   */
  buildReponse() {
    let response = {};

    // Iterate throught all frequencies
    this.frequencies.forEach((frequencyObj) => {
      // Assign the name value to the key of the response object
      // and the value will be the return value of parse cron
      response[frequencyObj["name"]] = frequencyObj["crons"].reduce((prev, cron) => {
        // Concat all results from _parseCron
        return prev.concat(this._parseCron(cron));
      }, []);

      // While we are in this loop it seems like a reasonable time to sort
      // So we don't need to run another nested loop
      // In place (Destructive)
      response[frequencyObj["name"]].sort();
    });

    return response;
  };

  /**
   * @function _parseCron
   * @private
   * @param cron {String}
   * @return {Array}
   */
  _parseCron(cron) {
    // parser options
    let parserOptions = {
      currentDate: this.startDate,
      endDate: this.endDate,
      iterator: true
    };

    // Date Iso strings
    // Using a Set to prevent dups
    let dateISOStrings = new Set();

    try {
      var interval = cronParser.parseExpression(cron, parserOptions);
      let dateObject;
      // Good usecase to dust off a do-while loop
      do {
        // The next iterable
        dateObject = interval.next();
        // Only caching value for readablility
        let value = dateObject.value.toISOString();

        // If value does not exist already add to set
        if(value && !dateISOStrings.has(value)) {
          dateISOStrings.add(value);
        }
        // Run loop while there is a next date Object
      } while (!dateObject.done);
    } catch (err) {
      // "Out of the timespan range" Error Is not an error for the purpose of this exercise
      if(err.message !== "Out of the timespan range") {
        console.error(err.stack);
      }
    };

    // Return an array
    return Array.from(dateISOStrings);
  };

  /**
   * @function _validate
   * @private
   * @return {Boolean}
   */
  _isValid() {
    // We're going to check to see if the dates are valid before we proceed
    // Checking for null values first then make sure start_date < end_date
    // And frequencies is an array type
    return (this.startDate && this.endDate) &&
            (this.startDate < this.endDate) && (this.frequencies instanceof Array);
  };
};

// let test = new FrequencyRequest({
//   "start_date": "2016-02-01T08:00:00.000Z",
//   "end_date": "2016-02-28T08:00:00.000Z",
//   "frequencies": [
//       {
//         "name": "Monthly",
//         "crons": ["0 0 0 25 * *"]
//       },
//       {
//         "name": "BiWeekly",
//         "crons": ["0 0 0 20 * *", "0 0 0 10 * *"]
//       },
//       {
//         "name": "Weekly",
//         "crons": ["0 0 0 * * 5"]
//       },
//       {
//         "name": "Quarterly",
//         "crons": ["0 0 0 25 3 *", "0 0 0 27 6 *", "0 0 0 30 9 *", "0 0 0 22 12 *", "0 0 0 25 3 *"]
//       }
//     ]
//   }
// );

// console.log(test.buildReponse());
