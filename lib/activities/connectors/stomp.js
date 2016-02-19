'use strict';

const net = require('net');
const tls = require('tls');
const events = require('events');

const STOMP = {
    END_SEQ: `\n\0`,
    END_CHAR: `\0`,
    LF: `\n`,
    BODY_SEPARATOR: `\n\n`,
    HEADER_ASSIGN: `:`,
    RESPONSE_TYPES: ['MESSAGE', 'ERROR', 'RECEIPT', 'CONNECTED']
};

class FrameBuilder {
    constructor() {
    };

    static buildHeader(name, value) {
        return `${name}${STOMP.HEADER_ASSIGN}${value}\n`;
    }

    static buildHeaders(opts, command) {
        let optString = `${command}\n`;
        for (let name in opts) {
            if (!opts.hasOwnProperty(name)) continue;
            optString += FrameBuilder.buildHeader(name, opts[name]);
        }
        return optString;
    }

    static buildConnectFrame() {
        let frame = FrameBuilder.buildHeaders({'accept-version': '1.1'}, 'CONNECT');
        frame += STOMP.END_SEQ;
        return frame;
    }

    static buildSendFrame(options, body) {
        options['content-type'] = 'application/json;charset=utf8';
        options['content-length'] = body.length;
        options.persistent = true;

        let frame = FrameBuilder.buildHeaders(options, 'SEND');
        frame += STOMP.LF;
        frame += body;
        frame += STOMP.END_CHAR;
        return frame;
    }

    static buildSubscribeFrame(options, id) {
        options.id = id;
        options.ack = `client`;

        let frame = FrameBuilder.buildHeaders(options, 'SUBSCRIBE');
        frame += STOMP.END_SEQ;
        return frame;
    }

    static buildACKFrame(subId, msgId) {
        let frame = FrameBuilder.buildHeaders({'message-id': msgId, subscription: subId}, 'ACK');
        frame += STOMP.END_SEQ;
        return frame;
    }

    static buildNACKFrame(subId, msgId) {
        let frame = FrameBuilder.buildHeaders({'message-id': msgId, subscription: subId}, 'NACK');
        frame += STOMP.END_SEQ;
        return frame;
    }

    static buildDisconnectFrame() {
        let frame = FrameBuilder.buildHeaders({'receipt-id': 0}, 'DISCONNECT');
        frame += STOMP.END_SEQ;
        return frame;
    }
}

class FrameParser {
    constructor() {
    };

    static getCommand(frame) {
        for (let type of STOMP.RESPONSE_TYPES) if (frame.startsWith(type)) return type;
    }

    static parse(input) {
        // Add support for message with double \n by concatenating the decomposition array where index >= 1 to form message
        let decomposition = input.split(STOMP.BODY_SEPARATOR);
        let rawHeaders = decomposition[0].split(STOMP.LF);
        let rawMessage = decomposition[1].replace(STOMP.END_CHAR, '');

        rawHeaders.splice(0, 1); // removing the message type

        let headers = {};
        for (let header of rawHeaders) {
            let cut = header.split(STOMP.HEADER_ASSIGN);
            headers[cut[0]] = cut[1];
        }

        let content;
        try {
            content = JSON.parse(rawMessage);
        } catch (error) {
            content = rawMessage
        }
        return {content, headers};
    }
}

class Stomp extends events {
    constructor(options) {
        super();
        this.subscriptionIndex = 0;
        this.sendIndex = 1;
        this.pending = {};
        this.connectionTimeout = 10000;
        if (options) this.init(options);
    }

    init(options) {
        this.stream = net.createConnection(options.port, options.host);

        this.stream.on('error', (error) => {
            this.emit('ERROR', error);
        });

        this.stream.on('data', (buffer) => {
            let message = buffer.toString();
            const command = FrameParser.getCommand(message);

            if (command === 'ERROR') return this.emit('ERROR', message);
            if (command === 'MESSAGE') return this.emit('MESSAGE', FrameParser.parse(message));
            if (command === 'RECEIPT') {
                let parsedMessage = FrameParser.parse(message);
                let receipt = parsedMessage.headers['receipt-id'];
                if (receipt === 0) {
                    this.stream.end();
                    this.stream.unref();
                    return this.emit('DISCONNECT');
                }
                else if (this.pending[receipt]) {
                    let callback = this.pending[receipt];
                    delete this.pending[receipt];
                    callback();
                }
            }
            if (command === 'CONNECTED') return this.emit('CONNECTED');
        });

        this.stream.on('end', ()  => {
            //console.error('end');
        });

        this.stream.on('connect', () => {
            this.stream.write(FrameBuilder.buildConnectFrame());
        })
    }

    initP(options) {
        // TODO Add timeout
        return new Promise((resolve, reject)=> {
            this.init(options);
            let timeout = setTimeout(reject, this.connectionTimeout);
            this.on('CONNECTED', () => {
                clearTimeout(timeout);
                resolve();
            });
            this.on('ERROR', reject);
        })

    }

    send(destination, message, callback) {
        if (typeof message !== 'string') message = JSON.stringify(message);
        if (callback && typeof callback === 'function') this.pending[this.sendIndex] = callback;
        let receipt = this.sendIndex++;
        this.stream.write(FrameBuilder.buildSendFrame({destination, receipt}, message));
    }

    sendP(destination, message) {
        return new Promise((resolve)=> {
            this.send(destination, message, resolve);
        })
    }

    subscribe(destination) {
        this.stream.write(FrameBuilder.buildSubscribeFrame({destination}, ++this.subscriptionIndex));
        return this.subscriptionIndex;
    }

    ack(message) {
        this.stream.write(FrameBuilder.buildACKFrame(message.headers.subscription, message.headers['message-id']));
    }

    nack(message) {
        this.stream.write(FrameBuilder.buildNACKFrame(message.headers.subscription, message.headers['message-id']));
    }

    disconnect() {
        this.stream.write(FrameBuilder.buildDisconnectFrame());
    }
}


module.exports = Stomp;



