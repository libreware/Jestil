'use strict';

let Activity = require('../../lib/core/activity');

class Log extends Activity {
    constructor(opts) {
        super(opts);
    }

    run(input, context, callback) {
        if (this.params.logContext) console.log(`Context:\n${JSON.toString(context)}`);
        console.log(`\nLog:\n`, input);
        callback(null);
    }
}

module.exports = Log;
