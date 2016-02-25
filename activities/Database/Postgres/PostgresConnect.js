'use strict';

let Activity = require('../../../lib/core/activity');
let Validator = require('../../../lib/core/validator');
let PostgresConnector = require('../../../lib/activities/connectors/postgres');

class PostgresConnect extends Activity {
    constructor(opts) {
        super(opts);
        this.paramsValidator = Validator.compile({
            description: 'The connect activity will establish a connection and begin a transaction.',
            title: 'Log',
            type: 'object',
            expected: ['connection', 'id'],
            properties: {
                connection: {
                    type: 'object',
                    properties: {
                        username: {type: 'string', description: 'The connection user name'},
                        host: {type: 'string', description: 'The address of the postgres server'},
                        port: {type: 'int', description: 'The port of the postgres server'},
                        password: {type: 'string', description: 'The password'},
                        database: {type: 'string', description: 'The database where to connect'}
                    },
                    description: 'The connection object'
                },
                id: {
                    type: 'string',
                    description: 'Set a unique connection identifier to be able to reuse this connection.'
                }
            }
        });
    }

    run(input, context, callback) {
        if (context.connections[this.params.id]) {
            context.connections[this.params.id].query('BEGIN').then(() => callback()).catch(callback)
        } else {
            context.connections[this.params.id] = new PostgresConnector(this.params.connection);
            context.connections[this.params.id].connect.then(callback).catch(callback);
        }

    }
}

module.exports = PostgresConnect;
