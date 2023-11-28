
/**
 * @module request
 */

import {logger} from './logger.js';
import {EventBrokerError} from './error.js';
import {topicRouter, senders} from './init.js';


/**
 * Event broker request, plus corresponding {@link ClientId}.
 * A request q must have a property 'tag' taking one of
 * the values 'topic', 'pub', 'sub', 'unsub'. Respectively these:
 * create a topic with name q['name'], publish a message q['msg'] to
 * topic q['topic'], and subscribe
 * and unsubscribe to topic q['topic'].
 */
class Request {

  /**
   * Create a a pairing between a request object
   * and the client that made it.
   * @param {ClientId} cid the client's id
   * @param {Object} req the request object. This must contain a
   * property called 'tag', as explained above.
   */
  constructor(cid, req) {
    this.cid = cid;
    this.req = req;
  }

  /**
   * Handle this request. Any {@link Request.Error} it generates
   * will be sent back to the requesting sender.
   */
  handle() {
    try { handleRequest(this.cid, this.req); }
    catch (e) {
      const err = {error: e.message};
      logger.debug(`handle construct error ${JSON.stringify(err)}`);
      senders.sendTo(err, [this.cid]);
    }
  }
}


/**
 * Handle the request object sent by the given {@link Client}
 * @param {ClientId} cid the client's id
 * @param {Object} req the client's request.
 * @see request~Request
 */
const handleRequest = (cid, req) => {
  const tag = req['tag'];
  if (tag === undefined) throw new NoTagError(req, cid);

  switch (tag) {
    case 'topic':
      handleCreateTopic(cid, req);
      break;
    case 'sub':
      handleSubscribe(cid, req);
      break;
    case 'pub':
      handlePublish(cid, req);
      break;
    case 'unsub':
      handleUnsubscribe(cid, req);
      break;
    default:
      throw new Request.UnknownTagError(req);
  }
};


const handleCreateTopic = (clientId, req) => {
  if (!('name' in req)) throw new Request.NoTopicNameError(req);
  topicRouter.createTopic((req['name']));
}


const handlePublish = (clientId, req) => {
  if (!('topic' in req)) throw new Request.NoTopicError(req);
  const recipients = topicRouter.subscribersOf(req['topic']);
  senders.sendTo(req['msg'], recipients);
}


const handleSubscribe = (clientId, req) => {
  if (!('topic' in req)) throw new Request.NoTopicError(req);
  topicRouter.subscribe(clientId, req['topic']);
}


const handleUnsubscribe = (clientId, req) => {
  if (!('topic' in req)) throw new NoTopicError(req);
  topicRouter.unsubscribe(clientId, req['topic']);
}

///////////////////////////////////////////////////////////

/**
 * An {@link EventBrokerError} encountered during the processing
 * of a {@link Request}.
 */
Request.Error = class extends EventBrokerError {
  constructor(req, reason) {
    super(`Bad request: ${JSON.stringify(req)}: ${reason}`);
  }
}

Request.NoTagError = class extends Request.Error {
  constructor(req) {
    super(req, "missing 'tag' field");
  }
}

Request.UnknownTagError = class extends Request.Error {
  constructor(req) {
    super(req, `unknown tag '${req['tag']}'`);
  }
}

Request.NoTopicError = class extends Request.Error {
  constructor(req) {
    super(req, "missing 'topic' field");
  }
}

Request.NoTopicNameError = class extends Request.Error {
  constructor(req) {
    super(req, "missing 'name' field");
  }
}

export { Request };