'use strict';

let Activity = require('../../lib/core/activity');

/**
 * @param target: The target's unique id
 * @param closeAfterAck: Set to true to close the connection after ack
 */
class JMSAcknowledge extends Activity {
    constructor(opts) {
        super(opts);
    }

    run(input, context, callback) {
        let stomp = context.activities[this.params.target].stomp;
        stomp.ack(input);
        if (this.params.closeAfterAck) stomp.disconnect();
        callback();
    }
}

module.exports = JMSAcknowledge;
