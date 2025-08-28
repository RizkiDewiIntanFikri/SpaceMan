import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom"; // Corrected import statement
import { ThemeProvider } from "./context/themeContext.jsx";
// 1. Import the AuthProvider we just created
import { AuthProvider } from "./context/AuthProvider.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      {/* 2. Wrap the entire application with the AuthProvider */}
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
