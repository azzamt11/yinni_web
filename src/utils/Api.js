import axios from 'axios';
import { getToken, clearAuth } from '../Auth'; // Import your Auth functions

// --- 1. Define the Base URL ---
// It's best practice to store the API base URL in an environment variable.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8088'; 

// --- 2. Create the Axios Instance ---
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout requests after 10 seconds
});

// --- 3. Request Interceptor for Authentication ---
// This interceptor runs before every request.
api.interceptors.request.use(
  (config) => {
    // Retrieve the token using your `getToken` function
    const token = getToken();

    // If a token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors (e.g., network issues before sending)
    return Promise.reject(error);
  }
);

// --- 4. Response Interceptor for Error Handling ---
// This interceptor runs after receiving a response or error.
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Check if the error is due to an expired/invalid token (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Log the user out and redirect them to the login page
      console.error('Unauthorized (401): Token expired or invalid. Logging out.');
      clearAuth(); // Clear local/session storage authentication data
      
      // OPTIONAL: Redirect the user to the login page
      // window.location.href = '/auth/login'; 
    }
    // Reject the promise so the calling component can catch and handle the error
    return Promise.reject(error);
  }
);

export default api;