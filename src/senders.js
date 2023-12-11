
/**
 * Module providing the senders table type
 * @module senders
 */


import {MessageBrokerError} from './error.js';


/**
 * Table of senders
 */
class Senders {
  /**
   * Constructs a new sender table.
   *
   * For added modularity pass the logger in as an argument.
   * @param {*} logger the logger to use
   */
  constructor(logger) {
    this.logger = logger;
    this._senders = {};
  }

  /**
   * Indicate whether a sender is in the table
   * @param {*} sid the sender's id
   * @returns {boolean} Sender present?
   */
  senderIdIsPresent(sid) { return sid in this._senders; }

  /**
   * Add a sender to the table
   * @param {*} s the sender, which must have a method "id()" returning
   * a hashable id value
   * @throws {Senders.AlreadyPresent}
   */
  registerSender(s) {
    const sid = s.id();
    this.assertSenderIdAbsent(sid);
    this._senders[sid] = s;
    this.logger.info(`Now registered under ${sid}: ${s}`);
  }

  /**
   * Remove a sender from the table
   * @param {*} sid sender id
   * @throws {Senders.Absent} if the sender is not in the table
   */
  deregisterSender(sid) {
    this.assertSenderIdPresent(sid);
    delete this._senders[sid]
    this.logger.info(`${sid} now deregistered`);
  }

  /**
   * Get the sender corresponding to the given sender id
   * @param {*} sid sender id
   * @returns {*}
   */
  getSender(sid) {
    const sender = this._senders[sid];
    if (sender === undefined) throw new Senders.Absent(sid);
    return sender;
  }

  /**
   * Send the given message to the given senders
   * @param {*} msg message
   * @param {*} senderIds iterable of sender ids
   */
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

  /////////////////////////////////////////////////////////
  // helpers

  /**
   * Assert that a sender is already in the table
   * @param {*} sid the sender's id
   * @throws {Senders.Absent}
   */
  assertSenderIdPresent(sid) {
    if (!this.senderIdIsPresent(sid)) throw new Senders.Absent(sid);
  }

  /**
   * Assert that a sender is not in the table
   * @param {*} sid the sender's id
   * @throws {Senders.AlreadyPresent}
   */
  assertSenderIdAbsent(sid) {
    if (this.senderIdIsPresent(sid)) throw new Senders.AlreadyPresent(sid);
  }

}


/**
 * {@link MessageBrokerError} arising from a use of {@link Senders}
 */
Senders.Error = class extends MessageBrokerError {
  /**
   * @param {*} msg error message
   */
  constructor(msg) {
    super(msg);
  }
}

/**
 * A sender is already present
 */
Senders.AlreadyPresent = class extends Senders.Error {
  /**
   * @param {*} sid sender id
   */
  constructor(sid) {
    super(`Sender ${sid} is already here`);
  }
}


/**
 * A sender is absent
 */
Senders.Absent = class extends Senders.Error {
  /**
   * @param {*} sid sender id
   */
  constructor(sid) {
    super(`Sender ${sid} is absent`);
  }
}


export { Senders };
