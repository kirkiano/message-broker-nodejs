import {logger} from './../logger.js';
import {Client} from './base.js';
import {ClientId} from './id.js';


/**
 * Class that wraps a network socket
 */
class TcpClient extends Client {
  /**
   * @param {net.Socket} socket A Node.js TCP socket
   */
  constructor(socket) {
    super();
    this._cid = new ClientId(`${socket.remoteAddress}:${socket.remotePort}`);
    logger.debug(`Constructed ${this._cid}`);
    this.socket = socket;
  }

  /**
   * @returns {ClientId} a {@link ClientId} wrapping the socket address.
   */
  id() { return this._cid; }

  /**
   * @returns {string} String representation containing the client's
   * socket address
   */
  toString() {
    return `TCP client at ${this.id()}`;
  }

  /**
   * Sends the given data to the client.
   *
   * @param {Object} msg Anything that can be passed to JSON.stringify
   */
  send(msg) {
    const s = JSON.stringify(msg);
    logger.debug(`Sending to ${this.id()}: ${msg}`);
    this.socket.write(s + '\n');
  }

  /**
   * @param {function} f Should take one argument: the client input
   * parsed into JSON.
   */
  onInput(f) {
    this.socket.on('data', data => {
      try {
        const j = JSON.parse(data);
        f(j)
      }
      catch (e) {
        logger.error(`Error on input from ${this.id()}: ${e}`);
      }
    })
  }

  onClose(f) {
    this.socket.on('close', f);
  }
}


export { TcpClient };