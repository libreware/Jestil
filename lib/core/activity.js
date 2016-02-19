'use strict';

class Activity {
    constructor(opts) {
        this.type = opts.type;
        this.id = opts.id;
        this.name = opts.name;
        this.params = opts.params ? opts.params : {};
        this.transitions = opts.transitions;
        this.input = opts.input;
    }

    run(input, context, callback) {
        throw new Error('Activities must define a run method.');
    }
}

module.exports = Activity;
