import Axios from 'axios';

export const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://49.233.175.175:80"
    : "http://localhost:8080";

export const http = Axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});
