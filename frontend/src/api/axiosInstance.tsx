import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    alert('Session expired. Please login again.');
                    break;
                case 403:
                    alert('You do not have permission to perform this action.');
                    break;
                default:
                    alert('Something went wrong. Please try again later.');
            }
        } else if (error.request) {
            console.error('Error: No response received', error.request);
        } else {
            console.error('Error', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;