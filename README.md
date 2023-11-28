# Simple Event Broker

A rudimentary event broker, implemented in Node.js, to be used
for transitioning the RPG to a more distributed architecture, and
eventually to be replaced by Kafka, RabbitMQ, or whatever
ends up being most appropriate.

*NB*: Test coverage is still not as exhaustive as I would like.


## Execution

Environment variables:
* `HOST`: (optional) the listening address: either `0.0.0.0` or
  `127.0.0.1`. Default: `0.0.0.0`.
* `PORT`: (optional) port number on which to listen. Default: `3000`.
* `LOG_LEVEL`: (optional) choices are: `emerg`, `alert`, `crit` `error`, `warning`, `notice`, `info`, `debug`. Default: `info`.

Then run
```
make
```

## Testing

### Automated

```
make test
```

### Manual

Start three shells, then:

* In shell 1: `make`
* In shell 2: `gtelnet localhost 3000`
* In shell 2 enter `{"tag": "blah"}` and verify that the error occurs.
* In shell 2 enter `{"tag": "topic"}` and verify that the error occurs.
* In shell 2 enter `{"tag": "sub", "topic": "banana"}`.
* In shell 2 enter `{"tag": "sub", "topic": "banana"}` and verify that the
  error occurs.
* In shell 3: `gtelnet localhost 3000`
* In shell 2 enter `{"tag": "pub", "topic": "banana", "msg": "hello"}`.
  Verify that "hello" is sent to shell 2 and not to shell 3.
* In shell 3 enter `{"tag": "sub", "topic": "banana"}`
* In shell 2 enter `{"tag": "pub", "topic": "banana", "msg": "hello again"}`
  and verify that "hell again" is sent to both shells 2 and 3.
