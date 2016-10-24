# Cron To Dates
[![Build Status](https://travis-ci.org/zimmermanw84/phone-auth.png?branch=master)](https://travis-ci.org/zimmermanw84/cron_to_dates)
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/sindresorhus/awesome)

## Mission
Create an API that accepts a json payload of cron strings, and returns a json payload of valid (within a given datetime range) dates for these strings.

#### Frequency Object Example
```
[{
  name: "Monthly",
  crons: ["0 0 0 25 * *"] //the 25th of every month
},
{
  name: "Weekly",
  crons: ["0 0 0 * * 5"] //every friday
},
{
  name: "BiWeekly",
  crons: ["0 0 0 20 * *", "0 0 0 10 * *"] //the 10th and 20th of every month
},
{
  name: "Quarterly",
  crons: ["0 0 0 25 3 *", "0 0 0 27 6 *", "0 0 0 30 9 *", "0 0 0 22 12 *", "0 0 0 25 3 *"] //Mar 25, Jun 27, Sep 30, and Dec 22 - note duplicated Mar 25 entry
}]
```

## API

##### Host: ec2-54-67-99-63.us-west-1.compute.amazonaws.com
##### Protocol: HTTPS

```
POST /calculate-crons
BODY: <JSON>
{
  "start_date": <DATETIME-UTC>,
  "end_date": <DATETIME-UTC>,
  "frequencies": <ARRAY frequency>
}
```

Example request object.
POST Body:
```
{
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
}
```
Retruns a JSON response object. Properies are the name values of the requested frequencies and the values are arrays of datetime-utc (ISO String format) in acending order.

Example response.
```
{
  "Monthly":[
    "2016-02-25T00:00:00.000Z"
  ],
  "Weekly":[
    "2016-02-05T00:00:00.000Z",
    "2016-02-12T00:00:00.000Z",
    "2016-02-19T00:00:00.000Z",
    "2016-02-26T00:00:00.000Z"
  ],
  "BiWeekly":[
    "2016-02-10T00:00:00.000Z",
    "2016-02-20T00:00:00.000Z"
  ],
  "Quarterly":[]
}
```

## Sample Curl request

Use the [--insecure] flag with the curl request. Application uses a self signed certificate. The host only accepts HTTPS protocol.

```
curl --verbose --insecure -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{
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
}' "https://ec2-54-67-99-63.us-west-1.compute.amazonaws.com/calculate-crons?app_secret=<APP_SECRET>&app_id=<APP_ID>"
```

## Run Locally
####
Requirements:
 - Node.js (v4.2.3) & NPM
 - Mocha.js

Note: A test will fail if you don't have your computer's time set to UTC

Clone repo
```
$ git clone <this repo>
```
Install packages
```
$ cd <repo>
$ <sudo may apply> npm install
```
Run tests
```
$ npm run test
```
Start app
```
$ npm run start
```
