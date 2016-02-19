'use strict';

let ActivityIndex = require('../../activities/index');

class ActivityFactory {
    static create(activityDescription) {
        return new ActivityIndex[activityDescription.type](activityDescription);
    }
}

module.exports = ActivityFactory;

