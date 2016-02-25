'use strict';

class ActivityBuilder {
    constructor(type, id, name, params, input, transitions) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.transitions = transitions ? transitions : [];

        this.params = params;
        this.input = input;
    }

    addTransition(towards) {
        if (typeof towards !== 'string') towards = towards.id;
        this.transitions.push(towards);
    }

    compile() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            params: this.params,
            transitions: this.transitions
        }
    }
}

module.exports = ActivityBuilder;
