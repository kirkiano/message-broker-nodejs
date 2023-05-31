
import {TopicRouter} from './topicRouter.js';
import {logger} from './logger.js';
import {Senders} from './senders.js';


const topicRouter = new TopicRouter(logger);
topicRouter.createTopic('foo');
topicRouter.createTopic('bar');

const senders = new Senders(logger);



export { senders, topicRouter };