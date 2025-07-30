import axios from "axios";
const BASE_URL = 'https://usermgr-acme-8429-api-d45d8c8b0a10.herokuapp.com/api';

const api = axios.create({
    baseURL:BASE_URL
});

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('f_token');
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }
)

export default api;
