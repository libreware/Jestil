'use strict';

let Builder = require('../lib/builder/builder.js');
let connection = {port: 61613, host: '127.0.0.1'};
let destination = '/queue/test';

let Job = Builder.createJob('Book2Collection_job');

let Listener = Job.createActivity('JMSListen', {
    name: 'Queue Listener',
    params: {connection, destination}
}, true); // true indicates that this is the starter.

//TODO make the mapping creation more user friendly / less technical
let Book2Pivot = Job.createActivity('MapTransform', {
    name: 'Book 2 Pivot',
    input: {_jsonPath: '$.JMSListen1.content'}, //TODO make more user friendly
    params: {
        mapping: {
            myBooks: {
                authors: {_jsonPath: '$.store.book[*].author'},
                titles: {_jsonPath: '$.store.book[*].title'},
                totalPrice: {
                    _jsonPath: '$.store.book[*].price',
                    _transformation: '(arr) => arr.reduce((pre, curr) => pre + curr)'
                },
                favouriteBook: {_jsonPath: '$..book[3]'}
            }
        }
    }
});

let LogResult = Job.createActivity('Log', {
    name: 'Log result',
    input: {
        result: {
            _jsonPath: '$.Map_Transform1.myBooks.totalPrice',
            _transformation: '(res) => parseInt(res) + 1000'
        }
    }
});

let ACK = Job.createActivity('JMSAcknowledge', {
    name: 'ACK',
    input: {_jsonPath: '$.JMSListen1'},
    params: {target: Listener.id}
});


Listener.addTransition(Book2Pivot);
Book2Pivot.addTransition(LogResult);
LogResult.addTransition(ACK);

let result = Builder.compile();
console.log(result);
