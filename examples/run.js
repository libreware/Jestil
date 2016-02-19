'use strict';

const path = require('path');
const fs = require('fs');
const Runner = require('./../lib/core/jobRunner');
const Job = require('./../lib/core/job');

const jobJson = fs.readFileSync(path.join('job.json'));

Runner.run(new Job(jobJson));
