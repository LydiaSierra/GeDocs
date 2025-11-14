import axios from "axios";

const api = axios.create({
  baseURL: "/",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true, 
});


const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
if (token) {
  api.defaults.headers.common["X-CSRF-TOKEN"] = token;
}

export default api;
