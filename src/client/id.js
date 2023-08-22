

class ClientId {

  /**
   * @param cid {string} identificator clientis (string).
   */
  constructor(cid) {
    this.cid = cid;
  }

  toString = () => `client ${this.cid}`;
}


export { ClientId };