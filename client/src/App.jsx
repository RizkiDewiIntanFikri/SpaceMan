import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useUserStore } from "./stores/userStore";
import { connectSocket, disconnectSocket } from "./services/socketService";
function App() {
  // Get the authentication state and token from our Zustand store
  const { isAuthenticated, token } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket(token);
    }

    // This is a cleanup function. It runs when the component unmounts
    // or before the effect runs again. It ensures we disconnect the socket
    // when the user logs out.
    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, token]); // The effect depends on these values

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
