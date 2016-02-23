'use strict';

let extend = require('extend');
let transform = require('../activities/transform').transform;

function chainRun(previous, context, activity, activities) {
    // This line is actually magic ! It enables us to have an input from any previous activity transformed on the fly.
    if (activity.input) previous = transform(activity.input, context);
    if (!activity.checkParams()) throw new Error('Runtime error: Invalid activity parameters');
    activity.run(previous, context, (error, result) => {
        if (error) throw new Error(error);
        let newContext = {};
        newContext = extend(true, newContext, context); // We will see how useful this is
        newContext[activity.id] = result;
        newContext.activities[activity.id] = activity;
        for (let transition of activity.transitions) chainRun(result, newContext, activities[transition], activities);
    });
}

class Runner {
    static run(job) {
        chainRun({}, {activities: {}}, job.starter, job.activities);
    }
}

module.exports = Runner;
