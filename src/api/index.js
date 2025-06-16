import axios from "axios";

const api = axios.create({
  baseURL: "/",
  //baseURL: "https://api.football-data.org",
  headers: {
    "Content-Type": "applicattion/json",
    "X-Auth-Token": " d2b968804c0e4852a533383276290aef",
    //"X-Auth-Token": process.env.VUE_APP_FOOTBALL_API_KEY,
  },
});

export default api;
