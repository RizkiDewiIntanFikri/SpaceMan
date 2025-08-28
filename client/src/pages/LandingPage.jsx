import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useUserStore } from "../stores/userStore";

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const register = useUserStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }
    setIsLoading(true);
    setError("");

    const result = await register(username);

    if (result.success) {
      navigate("/stocks"); // Navigate to the main dashboard on success
    } else {
      setIsLoading(false);
      setError(result.message);
    }
  };

  return (
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
            <input
              type="text"
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-500"
          >
            {isLoading ? "Joining..." : "Start Trading"}
          </button>
        </form>
      </div>
    </div>
  );
}
