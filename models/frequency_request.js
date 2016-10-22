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
      this.startDate = requestData.start_date;
      this.endDate = requestData.end_date;
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
   * @return {Date - ISO}
   */
  _parseCron(cron) {
    let parserOptions = {
      currentDate: new Date(this.startDate),
      endDate: new Date(this.endDate),
      iterator: true
    };

    // Date Iso strings
    let dateISOStrings = new Set();

    try {
      var interval = cronParser.parseExpression(cron, options);

      do {
        let obj = interval.next();
        obj.value.toISOString();
      } while (!obj.done);
    } catch (err) {
      console.log('Error: ' + err.message);
    };
  };

  /**
   * @function _buildFrequenciesToISO
   * @private
   * @return {Array}
   */
  _buildFrequenciesToISO() {};

};
