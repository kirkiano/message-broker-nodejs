
import {logger} from './logger.js';
import {Senders} from './senders.js';
import {QueueClient} from './queueClient.js';


test('register sender', () => {
    let ss = new Senders(logger);
    let sname = 'foo';

    expect(ss.senderIdIsPresent(sname)).toBeFalsy();
    expect(ss.assertSenderIdAbsent(sname)).toBeUndefined();
    expect(() => ss.assertSenderIdPresent(sname))
        .toThrow(Senders.Absent);

    let s = new QueueClient(sname);
    ss.registerSender(s);

    expect(ss.senderIdIsPresent(sname)).toBeTruthy();
    expect(ss.assertSenderIdPresent(sname)).toBeUndefined();
    expect(() => ss.assertSenderIdAbsent(sname))
        .toThrow(Senders.AlreadyPresent);
});


test('deregister sender', () => {
    let ss = new Senders(logger);
    let sname = 'foo';
    expect(() => ss.deregisterSender(sname)).toThrow(Senders.Absent);

    let s = new QueueClient(sname);
    ss.registerSender(s);

    expect(ss.deregisterSender(sname)).toBeUndefined();
});


test('send', () => {
    let ss = new Senders(logger);
    let snames = ['foo', 'bar'];
    let msg = 'hello';
    expect(ss.sendTo(msg, [snames[0]])).toEqual([snames[0]]);

    let [s1, s2] = snames.map(n => new QueueClient(n));
    ss.registerSender(s1);
    ss.registerSender(s2);

    expect(ss.sendTo(msg, [snames[0]])).toEqual([]);
    expect(s1.queue).toEqual([msg]);
    expect(s2.queue).toEqual([]);
});
