import { BASE_URL } from "../baseUrl";
import axios from "axios";

const apiClient = axios.create({
    baseURL: BASE_URL,
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

export const registerUser = (username) => apiClient.post('/register', { username });
export const getPortfolio = () => apiClient.get('/portfolio');
export const getTradeHistory = () => apiClient.get('/trades');
export const placeTrade = (tradeDetails) => apiClient.post('/trades', tradeDetails);
export const getLeaderboard = () => apiClient.get('/leaderboard');

