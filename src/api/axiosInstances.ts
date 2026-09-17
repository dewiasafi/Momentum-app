import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =  "http://localhost:8080/api/v1";

export const publicRequest = axios.create({
     baseURL : API_BASE_URL,
     timeout: 10000,
     headers: {
          "Content-Type": "application/json",
     }
})

export const authRequest = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

authRequest.interceptors.request.use(
     (config: InternalAxiosRequestConfig) => {
          const token = localStorage.getItem("token");
          if (token && config.headers) {
               config.headers.Authorization = `Bearer ${token}`;
          }
          return config;     
     },
     (error: AxiosError) => Promise.reject(error)
);

authRequest.interceptors.response.use(
     (response) => response,
     (error: AxiosError) => {
          if(error.response?.status === 401) {
               localStorage.removeItem("token");
               window.location.href = "/login";
          }
          return Promise.reject(error);
     }
)