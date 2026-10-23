import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./component/AuthContext";
import Layout from "./component/Layout";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Students from "./Students";
import Teachers from "./Teachers";
import Courses from "./Courses";
import Attendance from "./Attendance";
import Results from "./Results";
import Fees from "./Fees";
import Notices from "./Notices";
import Profile from "./Profile";
import Admin from "./component/Admin";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="courses" element={<Courses />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="results" element={<Results />} />
            <Route path="fees" element={<Fees />} />
            <Route path="notices" element={<Notices />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
