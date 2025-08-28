const userSockets = new Map();

const socketManager = {
    addUser: (userId, socketId) => {
        userSockets.set(userId, socketId)
        console.log(`FROM SOCKET MANAGER : Socket connected for user ${userId} with SOCKET ID : ${socketId}`);
    },
    removeUser: (socketId) => {
        for (let [userId, id] of userSockets.entries()) {
            if (id === socketId) {
                userSockets.delete(userId);
                console.log(`FROM SOCKET MANAGER : Socket disconnected for user ${userId} with SOCKET ID : ${socketId}`);
                break;
            }
        }
    }, getSocketId: (userId) => {
        return userSockets.get(userId);
    }
}

module.exports = socketManager;