import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

// Create a function to get the token from context
const getAuthToken = () => {
  // This will be called from components that have access to AuthContext
  return null; // Will be overridden by the interceptor
};

api.interceptors.request.use((config) => {
  // Get token from localStorage (stored by the auth system)
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  if (userId) {
    config.headers["X-User-ID"] = userId;
  }

  // Get user ID from token data if available
  const tokenData = localStorage.getItem("tokenData");
  if (tokenData) {
    try {
      const parsedTokenData = JSON.parse(tokenData);
      if (parsedTokenData.sub) {
        config.headers["X-User-ID"] = parsedTokenData.sub;
      }
    } catch (e) {
      console.error("Error parsing token data:", e);
    }
  }

  // Log the request for debugging
  console.log("Making API request:", {
    method: config.method?.toUpperCase(),
    url: `${config.baseURL}${config.url}`,
    headers: config.headers,
    data: config.data
  });

  return config;
});

export const getActivities = () => api.get("/activities");
export const addActivity = (activity) => api.post("/activities", activity);
export const getActivityDetail = (id) =>
  api.get("recommendation/activity/${id}");
