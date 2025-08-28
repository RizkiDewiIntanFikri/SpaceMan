import axios from 'axios';
const BASE_URL = 'http://localhost:3000'; //! BUAT CONNECT KE BACKEND


// Create a central axios instance with our backend's base URL
const apiClient = axios.create({
    baseURL: BASE_URL
});

// This is a powerful "interceptor". It's a function that runs
// automatically BEFORE every single API request is sent.
apiClient.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('access_token');
        // If a token exists, add it to the 'Authorization' header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle any errors that occur during the request setup
        return Promise.reject(error);
    }
);

// --- API Functions ---
// We create a simple, named function for each backend endpoint.

export const registerUser = (username) => {
    return apiClient.post('/register', { username });
};

export const getPortfolio = () => {
    return apiClient.get('/portfolio');
};

export const getTradeHistory = () => {
    return apiClient.get('/trades');
};

export const placeTrade = (tradeDetails) => {
    // tradeDetails is an object like: { symbol, quantity, type }
    return apiClient.post('/trades', tradeDetails);
};

export const getLeaderboard = () => {
    return apiClient.get('/leaderboard');
};

// We can add more functions here later, like fetching stock history for charts.