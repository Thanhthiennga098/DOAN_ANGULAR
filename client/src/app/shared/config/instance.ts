import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookie from 'js-cookie';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

const instance = axios.create({
  baseURL: 'http://localhost:3055/v1/api',
});

instance.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    const token = Cookie.get('token');
    const userId = Cookie.get('userId');
    if (userId) {
      config.headers['x-client-id'] = userId;
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response: AxiosResponse<ApiResponse>) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
