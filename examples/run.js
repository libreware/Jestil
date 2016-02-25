'use strict';

const path = require('path');
const fs = require('fs');
const Runner = require('../lib/core/jobRunner');
const Job = require('../lib/core/job');

const jobJson = fs.readFileSync(path.join('job.json'), 'utf8');

Runner.run(new Job(jobJson));
