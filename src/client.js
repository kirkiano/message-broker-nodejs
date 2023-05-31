
/*
Javascript lacks the notion of a proper interface or abstract class.
But class 'Client' at least approximates one.
*/
class Client {

    constructor() {
        if (new.target === Client)
            throw new TypeError('Cannot instantiate abstract class Client');
    }

    id() {
        throw new TypeError('Cannot invoke abstract method Client.id');
    }

    send(msg) {
        throw new TypeError('Cannot invoke abstract method Client.send');
    }

    onInput(f) {
        throw new TypeError('Cannot invoke abstract method Client.onInput');
    }
    
    toString() {
        throw new TypeError('Cannot invoke abstract method Client.toString');
    }
}

export { Client };