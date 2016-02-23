'use strict';

class Activity {
    constructor(opts) {
        this.type = opts.type;
        this.id = opts.id;
        this.name = opts.name;
        this.params = opts.params ? opts.params : {};
        this.transitions = opts.transitions;
        this.input = opts.input;

        this.paramsValidator = () => {
            throw new Error('Schema validator must be defined.');
        };
    }

    run(input, context, callback) {
        throw new Error('Activities must define a run method.');
    }

    checkParams() {
        return this.paramsValidator(this.params);
    }
}

module.exports = Activity;
