import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "../pages/Landing";
import Portfolio from "../pages/Portfolio";
import Dashboard from "../pages/Dashboard";
import Protection from "./Protection";


export default function AppRoutes() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/portfolio"
            element={
              <Protection>
                <Portfolio />
              </Protection>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Protection>
                <Dashboard />
              </Protection>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
