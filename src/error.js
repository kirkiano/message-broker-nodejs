
/**
 * Error arising in the message broker
 */
class MessageBrokerError extends Error {
  constructor(msg) {
    super(msg);
  }
}

export { MessageBrokerError }
