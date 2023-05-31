
class TopicRouter {

    constructor(logger) {
        this.logger = logger;
        this._topics = {};
        this._senderIds = {};
    }

    topicExists = name => name in this._topics;

    assertTopicExists(topic) {
        if (!this.topicExists(topic)) throw new TopicRouter.DoesNotExist(topic);
    }

    assertTopicDoesNotExist(topic) {
        if (this.topicExists(topic)) throw new TopicRouter.AlreadyExists(topic);
    }

    createTopic(topic) {
        this.assertTopicDoesNotExist(topic);
        this._topics[topic] = new Set();
        this.logger.info(`Created topic '${topic}'`);
        // Set guarantees that a subscriber will not be added multiple times.
    }

    subscribe(sid, topic) {
        this.assertTopicExists(topic);
        this._topics[topic].add(sid);
        if (!(sid in this._senderIds)) this._senderIds[sid] = new Set();
        this._senderIds[sid].add(topic);
        this.logger.info(`${sid} now subscribed to topic '${topic}'`)
    }

    unsubscribe(sid, topic) {
        this.assertTopicExists(topic);
        this._topics[topic].delete(sid);
        if (sid in this._senderIds) {
            this._senderIds[sid].delete(topic);
            if (this._senderIds[sid].size === 0) delete this._senderIds[sid];
            this.logger.info(`${sid} now unsubscribed from topic '${topic}'`)
        }
    }

    // TODO: unit test for this
    unsubscribeAll(sid) {
        for (const t of this.topicsOf(sid)) this.unsubscribe(sid, t);
    }

    subscribeMany(sid, topics) {
        for (let topic of topics) this.subscribe(sid, topic);
    }

    topics = () => Object.keys(this._topics);
    subscribers = () => Object.keys(this._senderIds);

    subscribersOf = topic => {
        this.assertTopicExists(topic);
        return this._topics[topic];
    }

    topicsOf = sid => sid in this._senderIds ? this._senderIds[sid] : false;
}


TopicRouter.AlreadyExists = class extends Error {
    constructor(topic) {
        super(`Topic '${topic}' already exists`);
    }
}


TopicRouter.DoesNotExist = class extends Error {
    constructor(topic) {
        super(`Topic '${topic}' does not exist`);
    }
}


export { TopicRouter };