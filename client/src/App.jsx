import { Routes, Route, Navigate } from 'react-router'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import StocksDashboard from "./pages/StocksDashboard";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stocks" element={<StocksDashboard />} />
      </Routes>
    </Layout>
  )
}