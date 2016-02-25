'use strict';

let Builder = require('../lib/builder/builder.js');
let TBuilder = require('../lib/builder/lib/transformBuilder.js');
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
    input: TBuilder.path(`$.${Listener.id}.content`), //TODO make more user friendly
    params: {
        mapping: {
            myBooks: {
                authors: TBuilder.path('$.store.book[*].author'),
                titles: TBuilder.path('$.store.book[*].title'),
                totalPrice: TBuilder.transform(TBuilder.path('$.store.book[*].price'), (arr) => arr.reduce((pre, curr) => pre + curr)),
                favouriteBook: TBuilder.path('$..book[3]')
            }
        }
    }
});

let LogResult = Job.createActivity('Log', {
    name: 'Log result',
    input: {
        result: TBuilder.transform(TBuilder.path(`$.${Book2Pivot.id}.myBooks.totalPrice`), (res) => parseInt(res) + 1000)
    }
});

let ACK = Job.createActivity('JMSAcknowledge', {
    name: 'ACK',
    input: TBuilder.path(`$.${Listener.id}`),
    params: {target: Listener.id}
});


Listener.addTransition(Book2Pivot);
Book2Pivot.addTransition(LogResult);
LogResult.addTransition(ACK);

let result = Builder.compile();
console.log(result);
