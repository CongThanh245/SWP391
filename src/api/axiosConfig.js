import axios from 'axios';

const API_BASE_URL = "http://localhost:8088/api/v1";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
    
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        
        if (response?.status === 401) {
           
            console.warn('Authentication failed, clearing tokens');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            
            window.location.href = '/login';
        } else if (response?.status === 403) {
            
            console.warn('Access forbidden');
        } else if (response?.status >= 500) {
            
            console.error('Server error:', response?.data?.message || 'Internal server error');
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;   
