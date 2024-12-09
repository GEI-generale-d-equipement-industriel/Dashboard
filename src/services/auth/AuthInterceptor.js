import axios from 'axios';
import store from '../../store/index'
import { removeAuthData } from '../../store/authSlice';
import { setCookie,deleteCookie } from '../../utils/cookieUtils';



const apiUrl = process.env.REACT_APP_API_BASE_URL|| '/api';
// console.log("API Base URL:", apiUrl);

class AuthInterceptor {  
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: apiUrl,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        this.axiosInstance.interceptors.request.use(
            (config) => {
                // No need to manually set Authorization header if using cookies
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response.data,
            (error) => {
                if (error.response && error.response.status === 401) {
                    store.dispatch(removeAuthData());
                    // Optionally, broadcast logout
                    this.syncTokenAcrossTabs('LOGOUT');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Updates the authentication token.
     * @param {string|null} token - The new token or null to remove.
     */
    updateToken(token) {
        
        if (token) {
            sessionStorage.setItem("token", token);
            setCookie('authToken', token);
            this.syncTokenAcrossTabs('LOGIN', token);
        } else {
            sessionStorage.removeItem("token");
            deleteCookie('authToken');
            this.syncTokenAcrossTabs('LOGOUT');
        }
        this.axiosInstance.defaults.headers.Authorization = token ? `Bearer ${token}` : '';
    }

     /**
     * Broadcasts authentication state changes across tabs.
     * @param {string} action - 'LOGIN' or 'LOGOUT'.
     * @param {string|null} token - The authentication token.
     */
     syncTokenAcrossTabs(action, token ) {
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('auth-channel');
            channel.postMessage({ action, token });
            channel.close();
        }
    }
    /**
     * Retrieves the Axios instance.
     * @returns {AxiosInstance} - The Axios instance.
     */
    getInstance() {
        return this.axiosInstance;
    }
}

const authInterceptorInstance = new AuthInterceptor();
export default authInterceptorInstance;

