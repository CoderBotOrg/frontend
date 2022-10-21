class WifiConnect {
  constructor(CB, axios) {
    this.CB = CB + '/wifi/v1';
    this.$axios = axios;
  }

  networks() {
    return this.$axios.get(`${this.CB}/list_access_points`);
  }

  connect(ssid, conn_type, username, password) {
    return this.$axios.post(`${this.CB}/connect`, {
      ssid: ssid,
      conn_type: conn_type,
      username: username,
      password: password,
    });
  }

  disconnect() {
    return this.$axios.post(`${this.CB}/forget`, {
      all_networks: true
    });
  }

  set_hotspot_ssid(ssid) {
    return this.$axios.post(`${this.CB}/sset_hotspot_ssid`, {
      ssid: ssid
    });
  }

  set_hotspot_password(password) {
    return this.$axios.post(`${this.CB}/set_hotspot_password`, {
      ssid: password
    });
  }

  connection_status() {
    return this.$axios.get(`${this.CB}/connection_status`);
  }
}

export default WifiConnect;
