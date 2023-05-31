import net from 'net';

import {logger} from './logger.js';
import {topicRouter, senders} from './init.js';
import {TcpClient} from './tcpClient.js';
import {handleRequest} from './handle.js';


const host = '127.0.0.1';
const port = 3000;

const server = net.createServer();
server.listen(port, host, () => {
    logger.info(`Server listening on ${host}:${port}`);
});


server.on('connection', socket => {
    console.log(JSON.stringify(socket.address()));
    let c = new TcpClient(logger, socket);
    senders.registerSender(c);
    c.onClose(hadError => cleanupClient(c, hadError)); // TODO: partialize
    c.onInput(q => handleRequest(logger, senders, topicRouter, c.id(), q));
});


const cleanupClient = (client, badly) => {
    const cid = client.id();
    logger.warn(`${cid} closed${badly ? ' (badly)': ''}`);
    topicRouter.unsubscribeAll(cid);
    senders.deregisterSender(cid);
};