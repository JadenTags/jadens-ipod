import axios from 'axios';

axios.defaults.withCredentials = false;
axios.defaults.baseURL = 'https://api.spotify.com/v1';

export default axios;