'use strict';

let Activity = require('../../lib/core/activity');
let Stomp = require('../../lib/activities/connectors/stomp');

/**
 * @param sendOnlyOne: Disconnects after sending a single message
 * @param destination: Destination queue/topic
 * @param connection: The connection
 * @param connection.host: The host name
 * @param connection.port: The port
 */
class JMSSend extends Activity {
    constructor(opts) {
        super(opts);
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
