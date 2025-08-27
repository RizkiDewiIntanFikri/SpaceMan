import React, { useState } from "react";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "react-router";

// Note: Your AppRoutes.jsx will automatically handle redirecting
// the user away from this page if they are already logged in.

function Landing() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get the 'register' action from our Zustand store
  const register = useUserStore((state) => state.register);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError("");

    const result = await register(username);

    setIsLoading(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
    // On success, the state change in userStore will trigger the redirect in AppRoutes.jsx
  };

  return (
    // Main container: Centers the content vertically and horizontally on all screen sizes.
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-white">
          Live Trading Simulator
        </h1>
        <p className="text-gray-400 mb-6 text-center">
          Enter a username to start with $100,000.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Choose your trader name"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? "Joining..." : "Start Trading"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Landing;
