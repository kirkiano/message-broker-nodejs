import {logger} from './logger.js';
import {EventBrokerError} from './error.js';
import {topicRouter, senders} from './init.js';


class Request {

  constructor(cid, req) {
    this.cid = cid;
    this.req = req;
  }

  /**
   * Nullam exceptionem iaciet.
   */
  handle() {
    try {
      handleRequest(this.cid, this.req);
    } catch (e) {
      senders.sendTo(e, this.cid);
      logger.warn(`Error for ${this.cid}: ${e}`);
    }
  }
}


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
      throw new UnknownTagError(req);
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

Request.Error = class extends EventBrokerError {
  constructor(req, reason) {
    super(`Bad request: ${req}: ${reason}`);
  }
}

Request.NoTagError = class extends Request.Error {
  constructor(req) {
    super(req, "missing 'tag' field");
  }
}

Request.UnknownTagError = class extends Request.Error {
  constructor(req) {
    super(req, `unknown tag "${req['tag']}"`);
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