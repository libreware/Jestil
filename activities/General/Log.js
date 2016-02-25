'use strict';

let Activity = require('../../lib/core/activity');
let Validator = require('../../lib/core/validator');

class Log extends Activity {
    constructor(opts) {
        super(opts);
        this.paramsValidator = Validator.compile({
            description: 'The log activity parameter schema',
            title: 'Log',
            type: 'object',
            properties: {
                logContext: {type: 'boolean', description: 'Set to true to log the context. Default: false'}
            }
        });
    }

    run(input, context, callback) {
        if (this.params.logContext) console.log(`Context:\n${JSON.toString(context)}`);
        console.log(`\nLog:\n`, input);
        callback(null);
    }
}

module.exports = Log;
