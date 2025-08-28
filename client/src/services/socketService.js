import { io } from 'socket.io-client';
// Import the stores so the service can call their update actions
import { usePortfolioStore } from '../stores/portfolioStore';
import { useMarketStore } from '../stores/marketStore';
import { useLeaderboardStore } from '../stores/leaderboardStore';

// This variable will hold our single, persistent socket connection
let socket;

export const connectSocket = (token) => {
    // If a socket already exists, disconnect it first to ensure a clean connection
    if (socket) {
        socket.disconnect();
    }

    // Connect to the backend socket server
    socket = io('http://localhost:3000'); // Make sure this port matches your backend

    // --- Set up event listeners ---

    socket.on('connect', () => {
        console.log('Socket connected successfully:', socket.id);
        // After connecting, we immediately send our JWT to be authenticated
        if (token) {
            socket.emit('authenticate', token);
        }
    });

    // Listen for the public 'price-update' broadcast
    socket.on('price-update', (priceUpdates) => {
        console.log('Received price-update:', priceUpdates);
        // Call the action in our marketStore to update the state
        useMarketStore.getState().updatePricesFromSocket(priceUpdates);
    });

    // Listen for the private 'portfolio-updated' message
    socket.on('portfolio-updated', (newPortfolioData) => {
        console.log('Received portfolio-updated:', newPortfolioData);
        // Call the action in our portfolioStore
        usePortfolioStore.getState().updatePortfolioFromSocket(newPortfolioData);
    });

    // Listen for the public 'leaderboard-update' broadcast
    socket.on('leaderboard-update', (newLeaderboardData) => {
        console.log('Received leaderboard-update:', newLeaderboardData);
        // Call the action in our leaderboardStore
        useLeaderboardStore.getState().updateLeaderboardFromSocket(newLeaderboardData);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
    });

    return socket;
};

// A function to disconnect the socket, which we'll call on logout
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};