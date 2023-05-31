

const handleRequest = (logger, senders, topicRouter, clientId, req) => {
    switch (req['tag']) {
        case 'sub':
            topicRouter.subscribe(clientId, req['topic']);
            break;
        case 'pub':
            const recipients = topicRouter.subscribersOf(req['topic']);
            const msg = req['msg'];
            senders.sendTo(msg, recipients);
            break;
        default:
            logger.error(`Unrecognized request from ${clientId}: ${req}`)
    }
};


export { handleRequest };