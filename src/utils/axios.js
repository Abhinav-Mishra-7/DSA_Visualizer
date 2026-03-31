import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// 🔥 CREATE INSTANCE
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ REQUIRED FOR COOKIES
  headers: {
    "Content-Type": "application/json"
  }
});


axiosClient.interceptors.response.use(
  (response) => response.data,

  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);

      if (error.response.status === 401) {
        console.log("Unauthorized - redirect to login");
      }

      return Promise.reject(error.response.data);
    }

    if (error.request) {
      console.error("No response from server");
      return Promise.reject({ message: "Server not responding" });
    }

    return Promise.reject(error.message);
  }
);


// // 🔥 OPTIONAL: REQUEST INTERCEPTOR
// api.interceptors.request.use((config) => {
//   // you can add custom headers here if needed
//   return config;
// });


// 🔥 MULTI PATH SUPPORT (LIKE YOUR CURRENT CODE)

// export const apiFirstAvailable = async (paths, options = {}) => {
//   if (!Array.isArray(paths) || paths.length === 0) {
//     throw new Error("No API paths provided");
//   }

//   let lastError = null;

//   for (const path of paths) {
//     try {
//       return await api({
//         url: path,
//         method: options.method || "GET",
//         data: options.data || null
//       });
//     } catch (err) {
//       if (err?.status !== 404) {
//         return Promise.reject(err);
//       }
//       lastError = err;
//     }
//   }

//   throw lastError || new Error("All API paths failed");
// };

export default axiosClient;