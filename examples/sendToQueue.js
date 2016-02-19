'use strict';

const Stomp = require('./../lib/activities/connectors/stomp.js');

let json = {
    "store": {
        "book": [
            {
                "category": "reference",
                "author": "Nigel Rees",
                "title": "Sayings of the Century",
                "price": 8.00
            },
            {
                "category": "fiction",
                "author": "Evelyn Waugh",
                "title": "The best of c++",
                "price": 2
            },
            {
                "category": "fiction",
                "author": "Herman Melville",
                "title": "Moby Dick II",
                "isbn": "0-553-21311-3",
                "price": 80.00
            },
            {
                "category": "fiction",
                "author": "J. R. R. Tolkien",
                "title": "The Lord of the Rings",
                "isbn": "0-395-19395-8",
                "price": 288.00
            }
        ],
        "bicycle": {
            "color": "red",
            "price": 19.95
        }
    }
};


let sender = new Stomp();
sender.initP({port: '61613', host: '127.0.0.1'}).then(() => {
    return sender.sendP('/queue/test', json)
}).then(() => {
    sender.disconnect();
    console.log(`Message sent`);
}).catch((error) => {
    console.error(error);
});