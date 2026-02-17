import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const forecastWithExplanation = (data) =>
  axios.post(`${API_URL}/forecast-with-explanation`, data);

export const simulateCombined = (data) =>
  axios.post(`${API_URL}/simulate-combined`, data);

export const sensitivityTree = (data) =>
  axios.post(`${API_URL}/sensitivity-tree`, data);
