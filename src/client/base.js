
/**
 * @module client/base
 */


/*
Javascript lacks the notion of a proper interface or abstract class.
But class 'Client' at least approximates one.
*/
/**
 * "Abstract class" of Client.
 */
class Client {

  constructor() {
    if (new.target === Client)
      throw new TypeError('Cannot instantiate abstract class Client');
  }

  toString() {
    throw new TypeError('Cannot invoke abstract method Client.toString');
  }

  /**
   * @returns {ClientId} the client's unique identifier
   */
  id() {
    throw new TypeError('Cannot invoke abstract method Client.id');
  }

  /**
   * Send the client a message
   *
   * @param {Object} _msg Message type depends on the {@link Client}
   */
  send(_msg) {
    throw new TypeError('Cannot invoke abstract method Client.send');
  }

  /**
   * Register an input handler
   *
   * @param {function} f A thunk to be invoked on each input from the client.
   * The type of its parameter will depend on the {@link Client}.
   */

  onInput(_f) {
    throw new TypeError('Cannot invoke abstract method Client.onInput');
  }

  /**
   * Register a closing function
   *
   * @param {function} f A thunk to be invoked when
   * underlying socket is closed
   */
  onClose(_f) {
    throw new TypeError('Cannot invoke abstract method Client.onClose');
  }
}

export {Client};