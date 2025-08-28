import { createContext, useContext, useEffect } from "react";
// 1. Import the tools we need
import { useUserStore } from "../stores/userStore";
import { connectSocket, disconnectSocket } from "../services/socketService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 2. Get the authentication state and token from our Zustand store
  const { isAuthenticated, token } = useUserStore();

  // 3. This useEffect hook is the core of the fix. It watches for changes
  //    in the user's login status.
  useEffect(() => {
    if (isAuthenticated) {
      // If the user is logged in, connect the socket
      console.log("AuthProvider: User is authenticated, connecting socket...");
      connectSocket(token);
    }

    // This is a cleanup function that runs when the user logs out
    return () => {
      console.log("AuthProvider: Cleaning up, disconnecting socket...");
      disconnectSocket();
    };
  }, [isAuthenticated, token]); // This effect re-runs whenever the login state changes

  // The context itself doesn't need to provide any value for now,
  // as Zustand is handling our state.
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
