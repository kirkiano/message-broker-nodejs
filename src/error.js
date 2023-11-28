
/**
 * Error arising in the event broker.
 */
class EventBrokerError extends Error {
  constructor(msg) {
    super(msg);
  }
}

export { EventBrokerError }