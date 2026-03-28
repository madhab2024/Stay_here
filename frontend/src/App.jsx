import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CustomerLayout from './layouts/CustomerLayout';
import OwnerLayout from './layouts/OwnerLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/customer/Home';
import Saved from "./pages/customer/Saved";
import Trips from "./pages/customer/Trips";
import PropertyDetails from "./pages/customer/PropertyDetails";
import Explore from "./pages/customer/Explore";
import Booking from "./pages/customer/Booking";
import OwnerDashboard from "./pages/owner/Dashboard";
import Properties from "./pages/owner/Properties";
import ManageRooms from "./pages/owner/ManageRooms";
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AdminProperties from "./pages/admin/Properties";
import AdminSettings from "./pages/admin/Settings";
import HostApplications from "./pages/admin/HostApplications";
import ProtectedRoute from "./auth/ProtectedRoute";
import { LoaderProvider } from './context/LoaderContext';
import Loader from './components/Loader';
import { useLoader } from './hooks/useLoader';
import ProfileLayout from "./pages/profile/ProfileLayout";
import Profile from "./pages/profile/Profile";
import BecomeHost from "./pages/customer/BecomeHost";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Descendant Routes for different roles */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'owner', 'admin']} />}>
          <Route path="/customer/*" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="saved" element={<Navigate to="/customer/profile/saved" replace />} />
            <Route path="trips" element={<Navigate to="/customer/profile/bookings" replace />} />
            <Route path="properties" element={<Explore />} />
            <Route path="property/:id" element={<PropertyDetails />} />
            <Route path="book" element={<Booking />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:tab" element={<Profile />} />
            <Route path="become-host" element={<BecomeHost />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner/*" element={<OwnerLayout />}>
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/:id/rooms" element={<ManageRooms />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="host-applications" element={<HostApplications />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Legacy profile route - redirect to role-specific profile */}
        <Route element={<ProtectedRoute allowedRoles={['customer', 'owner', 'admin']} />}>
          <Route path="/profile" element={<Navigate to="/owner/profile" replace />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const { isLoading } = useLoader();

  return (
    <>
      <Loader isVisible={isLoading} />
      <Router>
        <AnimatedRoutes />
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
