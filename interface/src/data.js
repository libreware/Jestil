module.exports = {
    "name": "Book2Collection_job",
    "id": 1,
    "starter": "JMSListen1",
    "finisher": "JMSAcknowledge1",
    "activities": {
        "JMSListen1": {
            "id": "JMSListen1",
            "type": "JMSListen",
            "name": "Queue Listener",
            "params": {
                "connection": {
                    "port": 61613,
                    "host": "127.0.0.1"
                },
                "destination": "/queue/test"
            },
            "transitions": ["MapTransform1"]
        },
        "MapTransform1": {
            "id": "MapTransform1",
            "type": "MapTransform",
            "name": "Book2Pivot",
            "input": {"_jsonPath": "$.JMSListen1.content"},
            "params": {
                "mapping": {
                    "myBooks": {
                        "authors": {"_jsonPath": "$.store.book[*].author"},
                        "titles": {"_jsonPath": "$.store.book[*].title"},
                        "totalPrice": {
                            "_jsonPath": "$.store.book[*].price",
                            "_transformation": "(arr) => arr.reduce((pre, curr) => pre + curr)"
                        },
                        "favouriteBook": {"_jsonPath": "$..book[3]"}
                    }
                }
            },
            "transitions": ["Iterate1"]
        },
        "Iterate1": {
            "id": "Iterate1",
            "type": "Iterate",
            "name": "Loop",
            "input": {"_jsonPath": "$.MapTransform1.myBooks.titles[*]"},
            "params": {
                "activities": {
                    "Log1": {
                        "id": "Log1",
                        "type": "Log",
                        "name": "Log result",
                        "input": {
                            "title": {"_jsonPath": "$.LoopItem"}
                        },
                        "transitions": []
                    }
                },
                "starter": "Log1",
                "finisher": "Log1"
            },
            "transitions": ["JMSAcknowledge1"]
        },
        "JMSAcknowledge1": {
            "id": "JMSAcknowledge1",
            "type": "JMSAcknowledge",
            "name": "ACK",
            "input": {"_jsonPath": "$.JMSListen1"},
            "params": {
                "target": "JMSListen1"
            },
            "transitions": []
        }
    }
};