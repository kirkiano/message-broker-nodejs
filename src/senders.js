
import {EventBrokerError} from './error.js';


class Senders {
  constructor(logger) {
    this.logger = logger;
    this._senders = {};
  }

  senderIdIsPresent = sid => sid in this._senders;

  assertSenderIdPresent(sid) {
    if (!this.senderIdIsPresent(sid)) throw new Senders.Absent(sid);
  }

  assertSenderIdAbsent(sid) {
    if (this.senderIdIsPresent(sid)) throw new Senders.AlreadyPresent(sid);
  }

  registerSender(s) {
    const sid = s.id();
    this.assertSenderIdAbsent(sid);
    this._senders[sid] = s;
    this.logger.info(`Now registered under ${sid}: ${s}`);
  }

  deregisterSender(sid) {
    this.assertSenderIdPresent(sid);
    delete this._senders[sid]
    this.logger.info(`${sid} now deregistered`);
  }

  getSender(sid) {
    const sender = this._senders[sid];
    if (sender === undefined) throw new Senders.Absent(sid);
    return sender;
  }

  sendTo(msg, senderIds) {
    let badSids = [];
    for (let sid of senderIds) {
      try {
        this.getSender(sid).send(msg);
        this.logger.info(`Sent to ${sid}: ${msg}`);
      }
      catch (e) {
        if (e instanceof Senders.Absent) badSids.push(sid);
        else { throw e; }
      }
    }
    return badSids;
  }
}


Senders.Error = class extends EventBrokerError {
  constructor(msg) {
    super(msg);
  }
}

Senders.AlreadyPresent = class extends Senders.Error {
  constructor(sid) {
    super(`Sender ${sid} is already here`);
  }
}


Senders.Absent = class extends Senders.Error {
  constructor(sid) {
    super(`Sender ${sid} is absent`);
  }
}


export { Senders };