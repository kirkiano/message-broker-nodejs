import net from 'net';

import {logger} from './logger.js';
import {handleClient} from './client/handle.js';


const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


const server = net.createServer();
const announceListening = () => logger.info(`Listening on ${host}:${port}`);
server.listen(port, host, announceListening);
server.on('connection', handleClient);