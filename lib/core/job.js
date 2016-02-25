'use strict';

let ActivityFactory = require('./activityFactory');

class Job {
    constructor(json) {
        let info;
        try {
            info = JSON.parse(json);
        } catch (parseError) {
            throw new Error('Cannot create job: invalid json');
        }

        this.name = info.name;
        this.id = info.id;
        this.starter = info.starter;
        this.activities = {};

        for (let key in info.activities) {
            if (!info.activities.hasOwnProperty(key)) continue;
            let activityDescription = info.activities[key];
            this.activities[key] = ActivityFactory.create(activityDescription)
        }
    }
}

module.exports = Job;
