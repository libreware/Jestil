module.exports = {
    spacing: 150,
    activityOpts: {containment: true, grid: [5, 5]},
    endpointOpts: {
        left: {isSource: false, isTarget: true, connector: "Straight"},
        right: {isSource: true, isTarget: false, connector: "Straight"}
    },
    jsplumbOpts: {},
    activitiesIcons: {
        JMSListen: '../assets/icons/oil.png',
        Log: '../assets/icons/notebook.png',
        MapTransform: '../assets/icons/diagram.png',
        Iterate: '../assets/icons/loop.png',
        JMSAcknowledge: '../assets/icons/ack.png'
    },
    startEndpoint: {
        endpoint: ['Image', {src: "../assets/icons/start.png"}],
        isSource: false,
        isTarget: true,
        connector: "Straight"
    },
    endEndpoint: {
        endpoint: ['Image', {src: "../assets/icons/end.png"}],
        isSource: true,
        isTarget: false,
        connector: "Straight"
    }
};