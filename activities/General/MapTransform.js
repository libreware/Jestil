'use strict';

let Activity = require('../../lib/core/activity');
let Transformation = require('../../lib/activities/transform');
let Validator = require('../../lib/core/validator');

class MapTransform extends Activity {
    constructor(opts) {
        super(opts);
        this.transform = new Transformation(this.params.mapping);
        this.paramsValidator = Validator.compile({
            description: 'The map transform activity parameter schema',
            title: 'MapTransform',
            type: 'object',
            required: ['mapping'],
            properties: {mapping: {type: 'object'}}
        });
    }

    run(input, context, callback) {
        callback(null, this.transform.execute(input));
    }
}

module.exports = MapTransform;
