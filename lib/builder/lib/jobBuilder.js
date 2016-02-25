'use strict';

let ActivityBuilder = require('./activityBuilder');

class JobBuilder {
    constructor(name, id) {
        this.name = name;
        this.id = id;

        this.activities = [];
        this.activityIndex = 0;
    }

    createActivity(type, opts, starter) {
        if (!type || !opts.name) throw new Error('Must provide at least type and name when creating activity');
        const id = `${type}${this.activityIndex}`;
        const activity = new ActivityBuilder(type, id, opts.name, opts.params, opts.input, opts.transitions);
        this.activities.push(activity);
        this.activityIndex++;

        if (starter) this.starter = id;

        return activity;
    }

    compile() {
        if (!this.starter) throw new Error('Job must have a starter');
        let activities = {};
        for (let activity of this.activities) {
            activities[activity.id] = activity.compile();
        }
        return {
            name: this.name,
            id: this.id,
            activities
        }
    }
}

module.exports = JobBuilder;