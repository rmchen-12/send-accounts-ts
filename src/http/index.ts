import Axios from 'axios';

export const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://49.233.175.175:443"
    : "http://localhost:8080";

export const http = Axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});
