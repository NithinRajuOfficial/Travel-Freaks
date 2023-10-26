// import axios from "axios";

// const instance = axios.create({
//     baseURL:"http://localhost:5500/api/"
// })

// instance.interceptors.request.use((config) =>{
//     const authTokens = localStorage.getItem("authTokens")
//     if(authTokens){
//         config.headers["Authorization"] = `bearer ${authTokens}`
//     }
//     return config
// })

// export default instance

import axios from "axios";


export const api = axios.create({
  baseURL: "http://localhost:5500/api/",
});

// export const refreshApi = axios.create({
//   baseURL: "http://localhost:5500/api/",
// });

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // Check if the request data contains an image
  // if (config.data instanceof FormData && config.data.has("image")) {
  //   // If the request data is FormData and contains an image, set the "Content-Type" header to "multipart/form-data"
  //   config.headers["Content-Type"] = "multipart/form-data";
  // }
  return config;
});

// Interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !error.config?._retry) {
      error.config._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const refreshResponse = await api.post("/auth/refresh", {
            refreshToken,
          });

          const newAccessToken = refreshResponse.data.accessToken;

          // Store the new access token
          localStorage.setItem("accessToken", newAccessToken);

          // Update the Authorization header for the Axios instance
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new access token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          // Handle the case where the refresh token is missing or expired
          // For example, you can log the user out or redirect to the login page
          // Remove tokens from localStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          location.reload()
          // Redirect to the login page
          // You can use a routing library like react-router-dom for this
          // Example: window.location.href = "/login";
        }
      } catch (refreshError) {
        // Handle errors during token refresh
        // Log the user out or redirect to the login page
        // Remove tokens from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Redirect to the login page
        // Example: window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
