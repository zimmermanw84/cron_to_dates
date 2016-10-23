//
//  test/integration.js
//
//  Created by Walt Zimmerman on 10//16.
//

"use strict";

const expect = require('chai').expect;
const supertest = require('supertest');

// App
const app = require('../app');

// Api
const api = supertest(app);

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

const EMPTY_FREQUENCY_TEST_DATA = {
  "start_date": "2016-02-01T08:00:00.000Z",
  "end_date": "2016-02-28T08:00:00.000Z",
  "frequencies": []
};

// Valid response data
const VALID_RESPONSE_DATA = {
  "Monthly":[
    "2016-02-25T08:00:00.000Z"
  ],
  "Weekly":[
    "2016-02-05T08:00:00.000Z",
    "2016-02-12T08:00:00.000Z",
    "2016-02-19T08:00:00.000Z",
    "2016-02-26T08:00:00.000Z"
  ],
  "BiWeekly":[
    "2016-02-10T08:00:00.000Z",
    "2016-02-20T08:00:00.000Z"
  ],
  "Quarterly":[]
};

// Sanity Check
describe(`Sanity Check`, () => {
  it(`Should return http response code 200`, (done) => {
    api.get('/').expect(200, done);
  });
});

describe(`Integration Tests`, () => {
  describe(`Invalid Route`, () => {
    it("Should return http response code 404", (done) => {
      api.get('/some-missing-route').expect(404, done);
    });
  });

  describe(`POST /calculate-crons`, () => {
    it("Should return a valid response given valid request body: http response code 200", (done) => {
      api
        .post("/calculate-crons")
        .send(VALID_TEST_DATA)
        .expect((res) => {
          expect(res.body).to.deep.equal(VALID_RESPONSE_DATA);
        })
        .expect(200, done);
    });

    it("Should return an error response given an invalid request body: http response code 400", (done) => {
      api
        .post("/calculate-crons")
        .send({}) // invalid request
        .expect((res) => {
          expect(res.body).to.have.property("error");
          expect(res.body.error).to.equal("Invalid Request Data");
        })
        .expect(400, done);
    });

    it("Should return an empty object given and empty frequencies array: http response code 200", (done) => {
      api
        .post("/calculate-crons")
        .send(EMPTY_FREQUENCY_TEST_DATA)
        .expect((res) => {
          expect(res.body).to.be.empty;
        })
        .expect(200, done);
    });
  });
});
