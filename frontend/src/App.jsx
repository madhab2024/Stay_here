import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CustomerLayout from './layouts/CustomerLayout';
import OwnerLayout from './layouts/OwnerLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/customer/Home';
import Saved from "./pages/customer/Saved";
import Trips from "./pages/customer/Trips";
import PropertyDetails from "./pages/customer/PropertyDetails";
import OwnerDashboard from "./pages/owner/Dashboard";
import Properties from "./pages/owner/Properties";
import ManageRooms from "./pages/owner/ManageRooms";
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AdminProperties from "./pages/admin/Properties";
import AdminSettings from "./pages/admin/Settings";
import ProtectedRoute from "./auth/ProtectedRoute";
import { LoaderProvider } from './context/LoaderContext';
import Loader from './components/Loader';
import { useLoader } from './hooks/useLoader';
import ProfileLayout from "./pages/profile/ProfileLayout";
import Profile from "./pages/profile/Profile";


function AppContent() {
  const { isLoading } = useLoader();

  return (
    <>
      <Loader isVisible={isLoading} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Descendant Routes for different roles */}
          <Route element={<ProtectedRoute allowedRoles={['customer', 'owner', 'admin']} />}>
            <Route path="/customer/*" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="saved" element={<Saved />} />
              <Route path="trips" element={<Trips />} />
              <Route path="property/:id" element={<PropertyDetails />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
            <Route path="/owner/*" element={<OwnerLayout />}>
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="properties" element={<Properties />} />
              <Route path="properties/:id/rooms" element={<ManageRooms />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Profile Routes - Common for all roles */}
          <Route element={<ProtectedRoute allowedRoles={['customer', 'owner', 'admin']} />}>
            <Route path="/profile" element={<ProfileLayout />}>
              <Route index element={<Profile />} />
            </Route>
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </>
  );
}

function App() {
  return (
    <LoaderProvider>
      <AppContent />
    </LoaderProvider>
  );
}

export default App;
