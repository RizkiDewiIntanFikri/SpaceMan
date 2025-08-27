import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "../context/authProvider";

import Chattbot from "../Pages/chattbot";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/chattbot" element={<Chattbot />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
