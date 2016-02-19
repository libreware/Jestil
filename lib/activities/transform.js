'use strict';

let JSONPath = require('JSONPath');


class Transformer {
    constructor(mapping) {
        this.mapping = mapping;
    }

    static transform(mapping, input) {
        let other = {};
        if (mapping._jsonPath !== undefined) return Transformer.transformOne(mapping._jsonPath, mapping._transformation, input);
        for (let key in mapping) {
            if (!mapping.hasOwnProperty(key)) continue;
            let value = mapping[key];

            if (value._jsonPath !== undefined) other[key] = Transformer.transformOne(value._jsonPath, value._transformation, input);
            else other[key] = Transformer.transform(value, input);
        }
        return other;
    }

    static transformOne(_jsonPath, _transformation, json) {
        _transformation = _transformation ? _transformation : (a) => a;

        try {
            if (typeof _transformation === "string") _transformation = eval(_transformation);
        } catch (error) {
            throw new Error('Unable to parse transformation function');
        }

        return _transformation(JSONPath({json, path: _jsonPath, wrap: false}));
    }

    execute(input) {
        return Transformer.transform(this.mapping, input);
    }
}

module.exports = Transformer;

