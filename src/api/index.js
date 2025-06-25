import axios from "axios";

const api = axios.create({
  baseURL: "/",
  //baseURL: "https://api.football-data.org",
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": " 8f32d253d64f4926979a07c8ac040ead",
    //"X-Auth-Token": process.env.VUE_APP_FOOTBALL_API_KEY,
  },
});

export default api;