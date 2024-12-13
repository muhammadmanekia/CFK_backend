const axios = require("axios");

const res = axios.get(
  "http://env-8355920.atl.jelastic.vps-host.net/api/events"
);

res.then((e) => console.log(e));
