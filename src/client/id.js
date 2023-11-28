

class ClientId {

  /**
   * @param cid {string} client identifier.
   */
  constructor(cid) {
    this.cid = cid;
  }

  toString = () => `client ${this.cid}`;
}


export { ClientId };