'use strict';

let Activity = require('../../lib/core/activity');
let Stomp = require('../../lib/activities/connectors/stomp');
let Validator = require('../../lib/core/validator');

class JMSSend extends Activity {
    constructor(opts) {
        super(opts);
        this.paramsValidator = Validator.compile({
            description: 'The jms send activity parameter schema',
            title: 'JMSSend',
            type: 'object',
            properties: {
                sendOnlyOne: {
                    type: 'boolean',
                    description: 'Set to true to close the connection after sending a single message. Default: false'
                },
                connection: {
                    type: 'object',
                    required: ['port','host'],
                    properties: {
                        port: {type: 'number', description:'Mandatory. The port number where to connect'},
                        host: {type: 'string', description:'Mandatory. The host url or ip'}
                    }
                },
                destination: {type: 'string', description:'Mandatory. The destination queue'}
            }
        });
    }

    run(input, context, callback) {
        this.stomp = new Stomp();
        this.stomp.initP(this.params.connection).then(() => {
            return this.stomp.sendP(this.params.destination, json)
        }).then(() => {
            if (this.params.sendOnlyOne) this.stomp.disconnect();
            callback()
        }).catch((error) => {
            throw new Error(error);
        });
    }
}

module.exports = JMSSend;
