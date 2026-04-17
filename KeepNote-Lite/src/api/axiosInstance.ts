// api/axiosInstance.ts
import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

const PROJECT1_URL = "https://69e0d26729c070e6597c1a31.mockapi.io/api/v1";
const PROJECT2_URL = "https://69e1db81b1cb62b9f3175e25.mockapi.io/api/v1";

// Dynamically assign baseURL depending on the route
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url?.startsWith("/logs")) {
    config.baseURL = PROJECT2_URL;
  } else if (config.url?.startsWith("/users") || config.url?.startsWith("/notes")) {
    config.baseURL = PROJECT1_URL;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response, // return full response so callers can read .data
  (error: AxiosError) => {
    // Centralized error handling
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);