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
    if(requestData) {
      this.startDate = new Date(requestData.start_date);
      this.endDate = new Date(requestData.end_date);
      this.frequencies = requestData.frequencies || [];
    }

  };

  /**
   * @function _buildReponse
   * @private
   * @return {Object}
   */
  _buildReponse() {};

  /**
   * @function _orderCrons
   * @private
   * @return {Void} - Side Effects
   */
  _orderCrons() {};

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
   * @function _buildFrequenciesToISO
   * @private
   * @return {Array}
   */
  _buildFrequenciesToISO() {};

};
