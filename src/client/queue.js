
import {Client} from './base.js';


// Used for mocking
class QueueClient extends Client {

  constructor(name) {
    super();
    this.name = name;
    this.queue = [];
  }

  id() {
    return this.name;
  }

  toString() {
    return `QueueClient '${this.name}'`;
  }

  send(something) {
    this.queue.push(something);
  }

  onInput(_f) {}
}


export { QueueClient }