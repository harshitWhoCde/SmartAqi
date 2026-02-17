import axios from "axios";

// Create ONE axios instance
const API = axios.create({
  baseURL: "https://aqi-forecast-api-1dn0.onrender.com",
});

// ---- API CALLS ----

export const forecastWithExplanation = (data) =>
  API.post("/forecast-with-explanation", data);

export const simulateCombined = (data) =>
  API.post("/simulate-combined", data);

export const sensitivityTree = (data) =>
  API.post("/sensitivity-tree", data);
