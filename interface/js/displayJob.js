function displayJob(graph, job) {
    "use strict";

    var translationDistance = 120;
    var activities = {};
    var graphItems = [];
    var linkAttr = {
        '.marker-source': {},
        '.marker-target': {fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z'}
    }

    var rect = new joint.shapes.basic.Rect({
        position: {x: 100, y: 30},
        size: {width: 100, height: 30},
        attrs: {rect: {fill: '#2C3E50', rx: 5, ry: 5}, text: {text: 'empty', fill: 'white'}}
    });

    var i = 1;
    for (var key in job.activities) {
        if (!job.activities.hasOwnProperty(key)) continue;
        var activity = job.activities[key];

        var activityRect = rect.clone();
        activityRect.translate(i++ * translationDistance);
        activityRect.attr({text: {text: activity.name}});

        activities[job.activities[key].id] = activityRect;
        graphItems.push(activityRect);

        //console.log(key, activity, activityRect.attributes.attrs.text.text);
    }

    for (var key in job.activities) {
        if (!job.activities.hasOwnProperty(key)) continue;
        var activity = job.activities[key];

        activity.transitions.map(function (item) {
            console.log(activities)
            var link = new joint.dia.Link({
                source: {id: activities[job.activities[key].id].id},
                target: {id: activities[item].id}
            });

            link.attr(linkAttr);

            graphItems.push(link);
        });
    }

    graph.addCells(graphItems);
}
