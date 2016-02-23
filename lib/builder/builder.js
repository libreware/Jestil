'use strict';

//TODO: separate into multiple files
//TODO: add json schema check for parameters when compiling an activity

class ActivityBuilder {
    constructor(type, id, name, params, input, transitions) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.transitions = transitions ? transitions : [];

        this.params = params;
        this.input = input;
    }

    addTransition(towards) {
        if (typeof towards !== 'string') towards = towards.id;
        this.transitions.push(towards);
    }

    compile() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            params: this.params,
            transitions: this.transitions
        }
    }
}

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
