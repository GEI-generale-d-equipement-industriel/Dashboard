import AuthInterceptor from "../auth/AuthInterceptor";
import {AxiosInstance} from 'axios'

class ApiService {
    constructor() {
        this.AxiosInstance=AuthInterceptor.getInstance()
    }
}