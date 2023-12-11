
/**
 * @module topicRouter
 */

import {logger} from './logger.js';
import {MessageBrokerError} from './error.js';


/**
 * Topic router
 *
 * Data structure that maps a given topic to its set of subscribers
 * and a given subscriber to its set of topics.
 */
class TopicRouter {

  /**
   * Creates a new topic router.
   *
   * For added modularity, the logger is passed in as an argument.
   * @param {*} logger the logger
   */
  constructor(logger) {
    this.logger = logger;
    this._subscribersOfTopic = {};
    this._topicsOfSubscriber = {};
  }

  /**
   * Create a new topic
   * @param {string} topic name of topic
   * @throws {TopicRouter.TopicAlreadyExists}
   */
  createTopic(topic) {
    this.assertTopicDoesNotExist(topic);
    this._subscribersOfTopic[topic] = new Set();
    // Set guarantees that a subscriber will not be added multiple times.
    this.logger.info(`Created topic '${topic}'`);
  }

  /**
   * The set of all topics
   * @returns {string[]} The topic names
   */
  topics() { return Object.keys(this._subscribersOfTopic); }

  /**
   * Indicates whether the given topic exists
   * @param {string} topic name of topic
   * @returns {boolean} Exists?
   */
  topicExists(topic) { return topic in this._subscribersOfTopic; }

  /**
   * The set of topics to which the given subscriber is subscribed
   * @param {any} sid the subscriber's id
   * @returns {Set<string>} The topic names
   */
  topicsOf(sid) {
    return sid in this._topicsOfSubscriber ?
      this._topicsOfSubscriber[sid] : new Set();
  }

  /**
   * The set of all subscribers
   * @returns {any[]} The subscriber ids
   */
  subscribers() { return Object.keys(this._topicsOfSubscriber); }

  /**
   * Subscribers of the given topic
   * @param {string} topic name of topic
   * @returns {Set<any>} The subscribers' ids
   * @throws {TopicRouter.NoSuchTopic}
   */
  subscribersOf(topic) {
    this.assertTopicExists(topic);
    return this._subscribersOfTopic[topic];
  }

  /**
   * Indicates whether the given subscriber is subscribed to the given topic
   * @param {*} sid the subscriber's id
   * @param {string} topic topic name
   * @returns {boolean} Subscribed?
   * @throws {TopicRouter.NoSuchTopic}
   */
  isSubscribed(sid, topic) {
    this.assertTopicExists(topic);
    return this.topicsOf(sid).has(topic);
  }

  /**
   * Subscribe the given id to the given topic
   * @param {*} sid subscriber id
   * @param {string} topic name of topic
   * @throws {TopicRouter.AlreadySubscribed}
   */
  subscribe(sid, topic) {
    this.assertTopicExists(topic);
    this.assertIsNotSubscribed(sid, topic);
    this._subscribersOfTopic[topic].add(sid);
    if (!(sid in this._topicsOfSubscriber))
      this._topicsOfSubscriber[sid] = new Set();
    this._topicsOfSubscriber[sid].add(topic);
    this.logger.info(`${sid} now subscribed to topic '${topic}'`);
  }

  /**
   * Remove the given subscriber from the given topic
   * @param {string} sid subscriber's id
   * @param {string} topic name of topic
   * @throws {TopicRouter.NotSubscribed}
   */
  unsubscribe(sid, topic) {
    this.assertIsSubscribed(sid, topic);
    this._subscribersOfTopic[topic].delete(sid);
    this._topicsOfSubscriber[sid].delete(topic);
    if (this._topicsOfSubscriber[sid].size === 0)
      delete this._topicsOfSubscriber[sid];
    this.logger.info(`${sid} now unsubscribed from topic '${topic}'`);
  }

  /**
   * Remove the given subscriber from all its topics.
   *
   * Unlike {@link unsubscribe}, throws no exception if
   * there ares no subscriptions.
   *
   * @param {*} sid subscriber id
   */
  unsubscribeAll(sid) {
    for (const t of this.topicsOf(sid)) this.unsubscribe(sid, t);
    this.logger.info(`${sid} unsubscribed from all topics`);
  }

  /////////////////////////////////////////////////////////
  // helpers

  assertIsSubscribed(sid, topic) {
    if (!(this.isSubscribed(sid, topic)))
      throw new TopicRouter.NotSubscribed(sid, topic);
  }

  assertIsNotSubscribed(sid, topic) {
    if (this.isSubscribed(sid, topic))
      throw new TopicRouter.AlreadySubscribed(sid, topic);
  }

  /**
   * Asserts that the given topic exists
   * @param {string} topic topic name
   * @throws {TopicRouter.NoSuchTopic}
   */
  assertTopicExists(topic) {
    if (!this.topicExists(topic)) throw new TopicRouter.NoSuchTopic(topic);
  }

  /**
   * Asserts that the given topic does not exist
   * @param {string} topic topic name
   * @throws {TopicRouter.AlreadyExists}
   */
  assertTopicDoesNotExist(topic) {
    if (this.topicExists(topic))
      throw new TopicRouter.TopicAlreadyExists(topic);
  }

}


TopicRouter.Error = class extends MessageBrokerError {
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
