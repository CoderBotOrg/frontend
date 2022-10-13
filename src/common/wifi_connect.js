class WifiConnect {
  constructor(CB, axios) {
    this.CB = CB + '/wifi';
    this.$axios = axios;
  }

  networks() {
    return this.$axios.get(`${this.CB}/networks`);
  }

  connect(ssid, identity, passphrase) {
    return this.$axios.post(`${this.CB}/connect`, {
      ssid: ssid,
      identity: identity,
      passphrase: passphrase,
    });
  }

  disconnect(ssid) {
    return this.$axios.post(`${this.CB}/disconnect`, {
      ssid: ssid,
    });
  }
}

export default WifiConnect;
