
import {logger} from '../logger.js';
import {senders, topicRouter} from '../init.js';


/**
 * Clean up after a {@link Client} that has disconnected.
 * This function will unsubscribe the client from all its topics
 * and deregister it from the table of active senders.
 *
 * @param {Client} client The closed {@link Client} to clean up
 * @param {boolean} badly Whether the client was closed badly
 */
const cleanupClient = (client, badly) => {
  const cid = client.id();
  logger.info(`${cid} closed${badly ? ' (badly)': ''}`);
  topicRouter.unsubscribeAll(cid);
  senders.deregisterSender(cid);
};


export { cleanupClient }