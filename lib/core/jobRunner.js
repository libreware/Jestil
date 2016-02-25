'use strict';

let extend = require('extend');
let transform = require('../activities/transform').transform;

class Runner {
    static run(job, callback) {
        Runner.chainRun({}, {activities: {}, connections: {}}, job.activities[job.starter], job.activities, callback)
    }

    static chainRun(previous, context, activity, activities, callback) {
        // This line is actually magic ! It enables us to have an input from any previous activity transformed on the fly.
        if (activity.input) previous = transform(activity.input, context);

        if (!callback || typeof callback !== 'function') callback = (a) => a;
        if (!activity.checkParams()) throw new Error('Runtime error: Invalid activity parameters');

        activity.run(previous, context, (error, result) => {
            if (error) throw new Error(error);
            context[activity.id] = result; // The parents can see the child's results

            let newContext = {};
            newContext = extend(true, newContext, context); // We will see how useful this is
            newContext.activities[activity.id] = activity;

            let callbackCounter = 0;

            for (let transition of activity.transitions) Runner.chainRun(result, newContext, activities[transition], activities, () => {
                if (++callbackCounter === activity.transitions.length) return callback();
            });
            if (activity.transitions.length === 0) return callback();
        });
    };
}

module.exports = Runner;
