import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const CustomerLayout = () => {
    const { role, upgradeToOwner, logout } = useAuth();
    const navigate = useNavigate();

    const handleBecomeHost = () => {
        upgradeToOwner();
        navigate('/owner/dashboard');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <span className="font-bold text-xl text-indigo-600">
                        StayHere
                    </span>

                    <div className="space-x-4 flex items-center">
                        {role === 'customer' && (
                            <button
                                onClick={handleBecomeHost}
                                className="text-sm font-medium text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-full border border-gray-200 transition-colors"
                            >
                                Become a Host
                            </button>
                        )}
                        <span className="text-gray-600 cursor-pointer">Explore</span>
                        <span className="text-gray-600 cursor-pointer">Saved</span>
                        <span className="text-gray-600 cursor-pointer">Trips</span>
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-red-600 font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
