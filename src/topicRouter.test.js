
import {logger} from './logger.js';
import {TopicRouter} from './topicRouter.js';


test('topic existence is correctly recognized', () => {
    let tr = new TopicRouter(logger);
    let topic = 'foo';
    tr.createTopic(topic);
    expect(tr.topicExists(topic)).toBeTruthy();
    expect(tr.topics().includes(topic)).toBeTruthy();
    expect(() => tr.assertTopicDoesNotExist(topic))
        .toThrow(TopicRouter.AlreadyExists);
    expect(tr.subscribersOf(topic).size).toEqual(0);
});


test('topic nonexistence is correctly recognized', () => {
    let tr = new TopicRouter(logger);
    let topic = 'foo';
    expect(tr.topicExists(topic)).toBeFalsy();
    expect(topic in tr.topics()).toBeFalsy();
    expect(() => tr.assertTopicExists(topic))
        .toThrow(TopicRouter.DoesNotExist);
});


test('topic cannot be created twice', () => {
    let tr = new TopicRouter(logger);
    let topic = 'foo';
    tr.createTopic(topic);
    expect(() => tr.createTopic(topic))
        .toThrow(TopicRouter.AlreadyExists);
});


test('cannot subscribe to a nonexistent topic', () => {
    let tr = new TopicRouter(logger);
    let topic = 'foo';
    let senderId = 42;
    expect(() => tr.subscribe(senderId, topic))
        .toThrow(TopicRouter.DoesNotExist);
});


test('subscribe', () => {
    let tr = new TopicRouter(logger);
    let topic = 'foo';
    let senderId = 42;
    expect(tr.subscribers().includes(senderId)).toBeFalsy();

    tr.createTopic(topic);
    expect(tr.subscribersOf(topic).has(senderId)).toBeFalsy();

    tr.subscribe(senderId, topic);

    expect(tr.topicsOf(senderId).has(topic)).toBeTruthy();
    expect(tr.subscribersOf(topic).has(senderId)).toBeTruthy();
    expect(tr.subscribers().includes(senderId.toString())).toBeTruthy();
});


test('unsubscribe', () => {
    let tr = new TopicRouter(logger);
    let topic = 'foo';
    let senderId = 42;
    tr.createTopic(topic);
    tr.subscribe(senderId, topic);
    tr.unsubscribe(senderId, topic);
    expect(tr.topicsOf(senderId)).toBeFalsy();
    expect(tr.subscribersOf(topic).has(senderId)).toBeFalsy();
    expect(tr.subscribers().includes(senderId.toString())).toBeFalsy();
});