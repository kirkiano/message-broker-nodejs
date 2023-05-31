
import {Client} from './client.js';


class TcpClient extends Client {
    constructor(logger, socket) {
        super();
        this._id = TcpClient.current_id; // undefined;
        TcpClient.current_id++;
        this.logger = logger;
        this.socket = socket;
    }

    id() {
        if (this._id === undefined) {
            const addr = this.socket.address();
            const host = addr['address'];
            const port = addr['port'];
            this._id = `${host}:${port}`;
        }
        return this._id;
    }

    toString() {
        return `TCP client at ${this.id()}`;
    }

    // msg should be JS object.
    send(msg) {
        const s = JSON.stringify(msg);
        this.socket.write(s + '\n');
    }

    onInput(f) {
        this.socket.on('data', data => {
            try {
                const j = JSON.parse(data);
                f(j)
            }
            catch(e) {
                if (e instanceof SyntaxError) {
                    this.logger.error(`${this.id()} failed to parse: ${data}`);
                }
                else {
                    throw e;
                }
            }
        })
    }

    onClose(f) {
        this.socket.on('close', f);
    }
}
// this is a hack to work around the problems with NodeJS's socket.address().
// the latter seems to be returning the address of the listening server,
// rather than the remote address of the peer.

TcpClient.current_id = 1;


export { TcpClient };