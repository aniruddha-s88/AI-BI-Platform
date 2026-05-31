import { BrowserRouter, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import UploadDataset from "./pages/UploadDataset"
import SmartDashboard from "./pages/Smartdashboard"
function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadDataset />
            </ProtectedRoute>
          }
        />
        <Route
          path="/smart-dashboard"
          element={
            <ProtectedRoute>
              <SmartDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  )
}

export default App
