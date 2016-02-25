'use strict';

let Activity = require('../../lib/core/activity');
let Validator = require('../../lib/core/validator');
let Runner = require('../../lib/core/jobRunner');

class Iterate extends Activity {
    constructor(opts) {
        super(opts);
        this.paramsValidator = Validator.compile({
            description: 'The iterate activity parameter schema. It can be used to iterate over an array of elements',
            title: 'Iterate',
            type: 'object',
            required: ['starter', 'activities', 'finisher'],
            properties: {
                activities: {type: 'object', description: 'The array of ids containing the activities in the loop'},
                starter: {type: 'string', description: 'The id of the starter activity'},
                finisher: {
                    type: 'string',
                    description: 'The last activity in the loop. Its result will be returned / aggregated'
                },
                aggregateResult: {
                    type: 'boolean',
                    description: 'Set to true to accumulate and return the result of the last activity.'
                }
            }
        });
        // TODO: Used twice make a method for that (see ../../lib/core/job.js)
        for (let key in this.params.activities) {
            if (!this.params.activities.hasOwnProperty(key)) continue;
            let activityDescription = this.params.activities[key];
            this.params.activities[key] = require('../../lib/core/activityFactory').create(activityDescription)
        }
    }

    run(input, context, callback) {
        let result = [];
        for (let item of input) {
            context.LoopItem = item;
            Runner.chainRun(item, context, this.params.activities[this.params.starter], this.params.activities, () => {
                if (this.params.aggregateResult) result.push(context[this.params.finisher]);
                else result = context[this.params.finisher];
            });
        }
        callback(null, result);
    }
}

module.exports = Iterate;

