import React, { useState } from "react";
import { useUserStore } from "../stores/userStore";

function LandingPage() {
  // State to manage the username input field
  const [username, setUsername] = useState("");
  // State to show loading or error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get the register function from our Zustand store
  const register = useUserStore((state) => state.register);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Call the register action from the userStore
    const result = await register(username);

    setIsLoading(false);

    if (!result.success) {
      // If registration failed, show the error message from the backend
      setError(result.message);
    }
    // If registration is successful, the `App.jsx` component's
    // `useEffect` will detect the change in `isAuthenticated`
    // and handle the socket connection. The router will handle the redirect.
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Join the Simulation
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Choose a Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., trader_jane"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500"
          >
            {isLoading ? "Joining..." : "Start Trading"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LandingPage;
