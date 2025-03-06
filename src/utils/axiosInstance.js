import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { base_url } from "./utils";

 const axiosInstance = axios.create({
    baseURL: base_url,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token =await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default axiosInstance