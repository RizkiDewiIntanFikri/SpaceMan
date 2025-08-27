import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "../context/authProvider";

import Dashboard from "../Pages/DashboardPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
