import {logger} from '../logger.js';
import {Request} from '../request.js';
import {TcpClient} from './tcp.js';
import {cleanupClient} from './cleanup.js';
import {senders} from '../init.js';


const handleClient = sock => {
  logger.debug(`Incoming cxn from ${sock.remoteAddress}:${sock.remotePort}`);
  let c = new TcpClient(sock);
  senders.registerSender(c);
  c.onClose(badly => cleanupClient(c, badly));
  c.onInput(req => new Request(c.id(), req).handle());
};


export { handleClient }