'use strict';

let Activity = require('../../lib/core/activity');
let Stomp = require('../../lib/activities/connectors/stomp');
let Validator = require('../../lib/core/validator');

class JMSListen extends Activity {
    constructor(opts) {
        super(opts);
        this.generator = true;
        this.paramsValidator = Validator.compile({
            description: 'The jms listen activity parameter schema',
            title: 'JMSListen',
            type: 'object',
            required: ['destination','connection'],
            properties: {
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
        this.stomp = new Stomp(this.params.connection);
        this.stomp.on('CONNECTED', () => this.stomp.subscribe(this.params.destination));
        this.stomp.on('MESSAGE', (message) => callback(null, message));
        this.stomp.on('ERROR', (err) => {
            throw new Error(`Queue listener error:\n${err}`)
        });
    }
}

module.exports = JMSListen;
