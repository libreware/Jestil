'use strict';

let Activity = require('../../lib/core/activity');
let Transformation = require('../../lib/activities/transform');

class MapTransform extends Activity {
    constructor(opts) {
        super(opts);
        this.transform = new Transformation(this.params.mapping);
    }

    run(input, context, callback) {
        callback(null, this.transform.execute(input));
    }
}

module.exports = MapTransform;
