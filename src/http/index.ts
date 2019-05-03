import Axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "production"
    ? "http://47.99.146.10:8080"
    : "http://localhost:8080";

export const http = Axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});
