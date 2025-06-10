import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'applicattion/json',
    'X-Auth-Token': ' d2b968804c0e4852a533383276290aef',
  },
})

export default api
