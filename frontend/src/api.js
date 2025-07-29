import axios from "axios";
const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL:BASE_URL
});

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('musha_front_token');
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }
)

export default api;