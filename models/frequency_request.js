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
   * @function _buildResponse
   * @public
   * @return {Object}
   */
  buildResponse() {
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
    console.log("START END TIME", this.startDate, this.endDate)
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
        console.log("VALUE", value)
        console.log("HELLO SEE IF WE CAN DIFF",new Date(dateObject.value).toISOString());

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
