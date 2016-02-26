'use strict';

let Activity = require('../../../lib/core/activity');
let Validator = require('../../../lib/core/validator');
let PostgresConnector = require('../../../lib/activities/connectors/postgres');

class PostgresQuery extends Activity {
    constructor(opts) {
        super(opts);
        this.paramsValidator = Validator.compile({
            description: 'The query activity will send a query to the database.',
            title: 'Log',
            type: 'object',
            expected: ['query', 'connection'],
            properties: {
                connection: {
                    oneOf: [{
                        type: 'object',
                        properties: {
                            username: {type: 'string', description: 'The connection user name'},
                            host: {type: 'string', description: 'The address of the postgres server'},
                            port: {type: 'int', description: 'The port of the postgres server'},
                            password: {type: 'string', description: 'The password'},
                            database: {type: 'string', description: 'The database where to connect'}
                        },
                        description: 'The connection object'
                    }, {type: 'string', description: 'Reference to a previously established connection'}]

                },
                id: {
                    type: 'string',
                    description: 'Set a unique connection identifier to be able to reuse this connection.'
                },
                query: {
                    oneOf: [{type: 'string', description: 'The query string'}, {
                        type: 'array',
                        description: 'an array of multiple string requests'
                    }]
                },
                args: {
                    type: 'array',
                    description: 'The ordered array of arguments to give in to the query(s). In case of multiple queries make a multi dimension array.'
                }
            }
        });
    }

    run(input, context, callback) {
        let db;
        if (typeof this.params.connection === 'string') db = context.connections[this.params.connection];
        else db = new PostgresConnector(this.params.connection);

        db.execute(this.params.query, this.params.args).then((result) => {
            callback(null, result.rows);
        }).catch((error) => {
            callback(error);
        });

        if (this.params.id) context.connections[this.params.id] = db;
    }
}

module.exports = PostgresQuery;