'use strict';

let pg = require("pg");

function parse(query, params) {
    var searchExpr = ' in $';

    while (query.toLowerCase().indexOf(searchExpr) !== -1) {
        var exprIndex = query.toLowerCase().indexOf(searchExpr);
        var index = query.substring(exprIndex + searchExpr.length, exprIndex + searchExpr.length + 1);
        var position = parseInt(index) - 1;

        var array = params.splice(position, 1)[0];

        // replace old param numbers
        // that might help and explain the $$ http://www.regular-expressions.info/javascript.html
        for (let i = params.length + 1; i > 0 && i > position + 1; i--) {
            let finalIndex = i + array.length - 1;
            query = query.replace(new RegExp("\\$" + i + "([^0-9])", 'g'), '$$' + finalIndex + '$1');
        }

        var list = '(';
        for (let i = 0; i < array.length; i++) {
            params.splice(position, 0, array[i]);
            let currentItemPosition = position + i + 1;
            list += '$$' + currentItemPosition + ',';
        }
        list = list.substring(0, list.length - 1) + ')';

        let listPosition = position + 1;
        query = query.replace(new RegExp('\\$' + listPosition + "([^0-9])", 'g'), list);
    }

    return query;
}

class PostgresConnector {
    constructor(cfg) {
        this.endpoint = `postgres://${cfg.user}:${cfg.password}@${cfg.host}:${cfg.port}/${cfg.database}`;
    }

    rollback() {
        return new Promise((resolve, reject) => {
            this.client.query('ROLLBACK', (err) => {
                if (err) {
                    this.done(err);
                    reject(err)
                } else resolve();
            });
        })

    }

    commit() {
        return new Promise((resolve, reject) => {
            this.client.query('COMMIT', (err) => {
                if (err) {
                    this.done(err);
                    reject(err)
                } else resolve();
            });
        })
    }

    connect() {
        return new Promise((resolve, reject) => {
            pg.connect(this.endpoint, (connectError, client, done) => {
                if (connectError) reject(connectError);
                this.client = client;
                this.done = done;
                client.query('BEGIN', (transactionError) => {
                    if (transactionError) this.rollback.then(()=> reject(transactionError)).catch((err) => reject(err));
                    process.nextTick(resolve);
                })
            })
        });
    }

    execute(query, data) {
        return new Promise((resolve, reject) => {
            query = parse(query, data);
            this.client.query(query, data, (queryError, result) => {
                if (queryError) this.rollback.then(()=> reject(queryError)).catch((err) => reject(err));
                resolve(result);
            });
        });
    }

    listen(topic, callback) {
        pg.connect(this.endpoint, (err, client) => {
            client.on('notification', callback);
            client.query(`LISTEN ${topic}`);

        });
    }
}

module.exports = PostgresConnector;
