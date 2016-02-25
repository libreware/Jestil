'use strict';

let Activity = require('../../../lib/core/activity');
let Validator = require('../../../lib/core/validator');

class PostgresRollback extends Activity {
    constructor(opts) {
        super(opts);
        this.paramsValidator = Validator.compile({
            description: 'The rollback activity will cancel the current transaction.',
            title: 'Log',
            type: 'object',
            expected: ['query', 'connection'],
            properties: {
                connection: {
                    type: 'string', description: 'Reference to a previously established connection'
                }
            }
        });
    }

    run(input, context, callback) {
        context.connections[this.params.connection].rollback().then(callback).catch(callback);
    }
}

module.exports = PostgresRollback;