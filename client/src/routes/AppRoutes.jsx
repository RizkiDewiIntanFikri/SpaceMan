import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "../pages/Landing";
import Portfolio from "../pages/Portfolio";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
