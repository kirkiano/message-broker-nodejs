
import {Client} from './client.js';


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

    onInput(f) {}

    onClose(f) {}
}


export { QueueClient }