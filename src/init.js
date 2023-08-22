
import {TopicRouter} from './topicRouter.js';
import {logger} from './logger.js';
import {Senders} from './senders.js';


const topicRouter = new TopicRouter(logger);

const senders = new Senders(logger);



export { senders, topicRouter };