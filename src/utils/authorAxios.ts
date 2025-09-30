import axios from "axios";

const axiosInterceptor = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

axiosInterceptor.interceptors.request.use(
  function (config: any) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    config.headers["Content-Type"] = "application/json";
    if (config.headers["mediaType"] === "file") {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

axiosInterceptor.interceptors.response.use(
  function (response: any) {
    return response;
  },
  function (error: any) {
    console.log(error);
    if (error.response?.status === 498) {
      // localStorage.removeItem("accessToken")
      // localStorage.removeItem("refreshToken")
      console.log("hết hạn");
    }
    return Promise.reject(error);
  }
);

export default axiosInterceptor;
