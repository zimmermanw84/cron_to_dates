//
//  test/unit.js
//
//  Created by Walt Zimmerman on 10//16.
//

"use strict";

// Mocha Expect
const expect = require('chai').expect;

// Model
const FrequencyRequest = require("../models/frequency_request");

// Test data
const VALID_TEST_DATA = {
  "start_date": "2016-02-01T08:00:00.000Z",
  "end_date": "2016-02-28T08:00:00.000Z",
  "frequencies": [
    {
      "name": "Monthly",
      "crons": ["0 0 0 25 * *"]
    },
    {
      "name": "BiWeekly",
      "crons": ["0 0 0 20 * *", "0 0 0 10 * *"]
    },
    {
      "name": "Weekly",
      "crons": ["0 0 0 * * 5"]
    },
    {
      "name": "Quarterly",
      "crons": ["0 0 0 25 3 *", "0 0 0 27 6 *", "0 0 0 30 9 *", "0 0 0 22 12 *", "0 0 0 25 3 *"]
    }
  ]
};

// Instance
let VALID_INSTANCE;

describe("Unit Tests For {class} FrequencyRequest", () => {
  // Build valid instance
  before(() => {
    VALID_INSTANCE = new FrequencyRequest(VALID_TEST_DATA);
  });

  it("FrequencyRequest#FrequencyRequest - new FrequencyRequest with valid data should create new object of type FrequencyRequest", (done) => {
    expect(VALID_INSTANCE).to.be.instanceOf(FrequencyRequest);
    expect(VALID_INSTANCE.frequencies).to.be.an("array");
    expect(VALID_INSTANCE.startDate).to.be.an("date");
    expect(VALID_INSTANCE.endDate).to.be.an("date");
    expect(VALID_INSTANCE.startDate.toISOString()).to.equal(VALID_TEST_DATA.start_date);
    expect(VALID_INSTANCE.endDate.toISOString()).to.equal(VALID_TEST_DATA.end_date);
    done();
  });

  it("FrequencyRequest#_isValid - new FrequencyRequest with start_date > end_date should throw an error", (done) => {
    try {
      // Invalid instance
      new FrequencyRequest({
        "start_date": "2017-02-01T08:00:00.000Z",
        "end_date": "2016-02-28T08:00:00.000Z",
        "frequencies": []
      });
    } catch (err) {
      expect(err.message).to.equal("Invalid Request Data");
      expect(err).to.be.instanceOf(TypeError);
      done();
    }
  });

  it("FrequencyRequest#_isValid - new FrequencyRequest with no start_date or no end_date should throw an error", (done) => {
    try {
      // Invalid instance
      new FrequencyRequest({ "frequencies": [] });
    } catch (err) {
      expect(err.message).to.equal("Invalid Request Data");
      expect(err).to.be.instanceOf(TypeError);
      done();
    }
  });

  it("FrequencyRequest#buildResponse - Should build a valid response object", (done) => {
    let response = VALID_INSTANCE.buildResponse();
    // We know the request so we can test all keys are returned
    expect(response).to.have.all.keys("Monthly", "Weekly", "BiWeekly", "Quarterly");

    // And values are intance or array
    for(let key in response) {
      expect(response[key]).to.be.an("array");
    }
    done();
  });

  it("FrequencyRequest#_parseCron - Should return an array of ISO date strings", (done) => {
    let cronArray = VALID_INSTANCE._parseCron("0 0 0 25 * *");
    // Even though the string entering the date contructor is iso is returns an string formated date
    // So calling toISOString on it can verify that we are testing an ISO date string
    let isoDateString = new Date(cronArray[0]).toISOString();

    expect(cronArray).to.be.an("array");
    expect(cronArray[0]).to.equal(isoDateString);
    done();
  });

  it("FrequencyRequest#_parseCron - Should return an empty array given cron outside of start_date-end_date range", (done) => {
    // "0 0 0 25 3 *" is an invalid cron given the range
    try {
      let cronArray = VALID_INSTANCE._parseCron("0 0 0 25 3 *");

      // The native parser throws an error - Test that error is caught
      expect(cronArray).to.be.an("array");
      expect(cronArray).to.be.empty;
      done();
    } catch (err) {
      // In case the error does get thrown we fail the test
      expect(err).to.be.undefined;
      done();
    }
  });
});
