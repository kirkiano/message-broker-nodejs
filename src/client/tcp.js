import {logger} from './../logger.js';
import {Client} from './base.js';
import {ClientId} from './id.js';


class TcpClient extends Client {
  constructor(socket) {
    super();
    this._cid = new ClientId(`${socket.remoteAddress}:${socket.remotePort}`);
    logger.debug(`Constructed ${this._cid}`);
    this.socket = socket;
  }

  id = () => this._cid;

  toString() {
    return `TCP client at ${this.id()}`;
  }

  // msg should be JS object.
  send(msg) {
    const s = JSON.stringify(msg);
    this.socket.write(s + '\n');
  }

  onInput(f) {
    this.socket.on('data', data => {
      try {
        const j = JSON.parse(data);
        f(j)
      } catch (e) {
        logger.error(`Error on input from ${this.id()}: ${e}`);
      }
    })
  }

  onClose(f) {
    this.socket.on('close', f);
  }
}


export { TcpClient };