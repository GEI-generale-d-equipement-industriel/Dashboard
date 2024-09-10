import axios from 'axios';

const apiUrl = "http://localhost:3002";

class AuthInterceptor {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: apiUrl,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Add the token to headers if it exists
                const token = localStorage.getItem("token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response.data;
            },
            (error) => {
                // Handle errors here (e.g., refresh token, logout user, etc.)
                return Promise.reject(error);
            }
        );
    }

    getInstance() {
        return this.axiosInstance;
    }

    updateToken(token) {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
        // Update the Authorization header
        this.axiosInstance.defaults.headers.Authorization = token ? `Bearer ${token}` : '';
    }
}

export default new AuthInterceptor();
