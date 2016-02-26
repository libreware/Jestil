'use strict';

let Activity = require('../../../lib/core/activity');
let Validator = require('../../../lib/core/validator');

class PostgresCommit extends Activity {
    constructor(opts) {
        super(opts);
        this.paramsValidator = Validator.compile({
            description: 'The commit activity will validate the current transaction.',
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
        context.connections[this.params.connection].commit().then(callback).catch(callback);
    }
}

module.exports = PostgresCommit;