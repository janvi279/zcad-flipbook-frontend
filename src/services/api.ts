import axios from "axios";

export const baseURL =
  "http://localhost:5000/api";
  // "https://zcad-flipbook-backend.onrender.com/api"

export default axios.create({
  baseURL,
});
