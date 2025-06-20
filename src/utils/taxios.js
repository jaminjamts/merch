import axios from 'axios';
import { BASE_URL } from '../constants/project';

const ERROR1 = 'Backend систем унтарсан байна!';
const instance = axios.create({
  baseURL: `${BASE_URL + '/'}`
});

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('accessToken');
    config.headers.Authorization = token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 401:
          handleLogout();
          break;
        case 500:
          handleLogout();
          break;
        default:
          break;
      }
    } else {
      console.log(ERROR1);
    }
    return Promise.reject(error);
  }
);

function handleLogout() {
  localStorage.removeItem('accessToken');
  window.location.href = '/';
}

export default instance;
