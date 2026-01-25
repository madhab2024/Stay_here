import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, role } = useAuth();

    // 1. Check if user is logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Check for role-based access
    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to customer home if role is not authorized
        return <Navigate to="/customer" replace />;
    }

    // 3. Render child routes
    return <Outlet />;
};

export default ProtectedRoute;
