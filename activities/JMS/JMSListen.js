'use strict';

let Activity = require('../../lib/core/activity');
let Stomp = require('../../lib/activities/connectors/stomp');

/**
 * @param destination: Destination queue/topic
 * @param connection: The connection
 * @param connection.host: The host name
 * @param connection.port: The port
 */
class JMSListen extends Activity {
    constructor(opts) {
        super(opts);
        this.generator = true;
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
