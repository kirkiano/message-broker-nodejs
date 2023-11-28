/**
 * Module holding the global topic router and sender table
 * @module init
 */

import {TopicRouter} from './topicRouter.js';
import {logger} from './logger.js';
import {Senders} from './senders.js';


/**
 * Global topic router
 */
const topicRouter = new TopicRouter(logger);

/**
 * Global table of senders
 */
const senders = new Senders(logger);



export { senders, topicRouter };