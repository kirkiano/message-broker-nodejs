import {logger} from './logger.js';
import {EventBrokerError} from './error.js';


class TopicRouter {

  constructor() {
    this._subscribersOfTopic = {};
    this._topicsOfSubscriber = {};
  }

  topics = () => Object.keys(this._subscribersOfTopic);

  subscribers = () => Object.keys(this._topicsOfSubscriber);

  topicExists = name => name in this._subscribersOfTopic;

  assertTopicExists(topic) {
    if (!this.topicExists(topic)) throw new TopicRouter.NoSuchTopic(topic);
  }

  assertTopicDoesNotExist(topic) {
    if (this.topicExists(topic))
      throw new TopicRouter.TopicAlreadyExists(topic);
  }

  /*
  assertSubscriberExists(sid) {
    if (!(this.subscriberExists(sid)))
      throw new TopicRouter.NoSuchSubscriber(sid);
  }
  */

  subscribersOf = topic => {
    this.assertTopicExists(topic);
    return this._subscribersOfTopic[topic];
  }

  /**
   * @param sid
   * @returns {*|Set<any>}
   */
  topicsOf = sid => sid in this._topicsOfSubscriber ?
    this._topicsOfSubscriber[sid] : new Set();

  /**
   * Necesse est thema necque subscriptorem existere.
   *
   * @param sid
   * @param topic
   * @returns {boolean}
   */
  isSubscribed(sid, topic) {
    this.assertTopicExists(topic);
    return this.topicsOf(sid).has(topic);
  }

  assertIsSubscribed(sid, topic) {
    if (!(this.isSubscribed(sid, topic)))
      throw new TopicRouter.NotSubscribed(sid, topic);
  }

  assertIsNotSubscribed(sid, topic) {
    if (this.isSubscribed(sid, topic))
      throw new TopicRouter.AlreadySubscribed(sid, topic);
  }

  createTopic(topic) {
    this.assertTopicDoesNotExist(topic);
    this._subscribersOfTopic[topic] = new Set();
    // Set guarantees that a subscriber will not be added multiple times.
    logger.info(`Created topic '${topic}'`);
  }

  /**
   * Exceptionem iaciet si subscriptio iam est.
   * @param sid
   * @param topic
   */
  subscribe(sid, topic) {
    this.assertTopicExists(topic);
    this.assertIsNotSubscribed(sid, topic);
    this._subscribersOfTopic[topic].add(sid);
    if (!(sid in this._topicsOfSubscriber))
      this._topicsOfSubscriber[sid] = new Set();
    this._topicsOfSubscriber[sid].add(topic);
    logger.info(`${sid} now subscribed to topic '${topic}'`)
  }

  /**
   * Exceptionem iaciet si subscriptio non est.
   * @param sid
   * @param topic
   */
  unsubscribe(sid, topic) {
    this.assertIsSubscribed(sid, topic);
    this._subscribersOfTopic[topic].delete(sid);
    this._topicsOfSubscriber[sid].delete(topic);
    if (this._topicsOfSubscriber[sid].size === 0)
      delete this._topicsOfSubscriber[sid];
    logger.info(`${sid} now unsubscribed from topic '${topic}'`)
  }

  /**
   * Dissimilis methodi 'unsubscribe', nullam exceptionem iaciet si
   * nulla subscriptio est.
   *
   * @param sid
   */
  unsubscribeAll(sid) {
    for (const t of this.topicsOf(sid)) this.unsubscribe(sid, t);
    logger.info(`${sid} unsubscribed from all topics`);
  }

  /* subscribeMany(sid, topics) {
    for (let topic of topics) this.subscribe(sid, topic);
  } */
}


TopicRouter.Error = class extends EventBrokerError {
  constructor(msg) {
    super(msg);
  }
}

TopicRouter.TopicAlreadyExists = class extends TopicRouter.Error {
  constructor(topic) {
    super(`Topic '${topic}' already exists`);
  }
}

TopicRouter.NoSuchTopic = class extends TopicRouter.Error {
  constructor(topic) {
    super(`Topic '${topic}' does not exist`);
  }
}

/*
TopicRouter.NoSuchSubscriber = class extends TopicRouter.Error {
  constructor(sid) {
    super(`Unknown subscriber: ${sid}`);
  }
}
 */

TopicRouter.NotSubscribed = class extends TopicRouter.Error {
  constructor(sid, topic) {
    super(`${sid} not subscribed to '${topic}'`);
  }
}

TopicRouter.AlreadySubscribed = class extends TopicRouter.Error {
  constructor(sid, topic) {
    super(`${sid} already subscribed to '${topic}'`);
  }
}

export {TopicRouter};