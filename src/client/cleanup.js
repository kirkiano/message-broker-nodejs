
import {logger} from '../logger.js';
import {senders, topicRouter} from '../init.js';


const cleanupClient = (client, badly) => {
  const cid = client.id();
  logger.info(`${cid} closed${badly ? ' (badly)': ''}`);
  topicRouter.unsubscribeAll(cid);
  senders.deregisterSender(cid);
};


export { cleanupClient }