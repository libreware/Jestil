'use strict';

let Activity = require('../../lib/core/activity');
let Validator = require('../../lib/core/validator');

class JMSAcknowledge extends Activity {
    constructor(opts) {
        super(opts);
        this.paramsValidator = Validator.compile({
            description: 'The jms acknowledge activity parameter schema',
            title: 'JMSAcknowledge',
            type: 'object',
            required: ['target'],
            properties: {
                closeAfterAck: {
                    type: 'boolean',
                    description: 'Set to true to close the connection after the ack is sent. Default: false'
                },
                target: {
                    type: 'string',
                    description: 'Mandatory. The id of the target JMSListen component'
                }
            }
        });
    }

    run(input, context, callback) {
        let stomp = context.activities[this.params.target].stomp;
        stomp.ack(input);
        if (this.params.closeAfterAck) stomp.disconnect();
        callback();
    }
}

module.exports = JMSAcknowledge;
