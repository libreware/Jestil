'use strict';

class TransformBuilder {
    constructor() {
    }

    static transform(p, f) {
        return {_jsonPath: p, _transformation: f.toString()};
    }

    static path(p) {
        return {_jsonPath: p};
    }
}

module.exports = TransformBuilder;