'use strict';

let JobBuilder = require('./lib/jobBuilder');

//TODO: add json schema check for parameters when compiling an activity
class Builder {
    constructor() {
        this.jobs = [];
        this.jobIndex = 0;
    }

    createJob(name) {
        const job = new JobBuilder(name, this.jobIndex);
        this.jobs.push(job);
        this.jobIndex++;

        return job;
    }

    compile() {
        if (this.jobs.length > 1) return JSON.stringify(this.jobs.map((job) => job.compile()));
        return JSON.stringify(this.jobs[0].compile())
    }
}

module.exports = new Builder();
